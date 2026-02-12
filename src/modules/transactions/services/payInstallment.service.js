const {
    transactionStatus,
    transactionType,
    accountType,
    notificationTypes,
    campaignStatus,
    currencies,
    paymentStatus,
} = require("../../../config/enums");
const moment = require("moment");
const { db } = require("../../../db/db");
const currencyService = require("../../currencies/services");
const transactionService = require("../services");

const payInstallment = async ({ user, installmentId, repaymentId }) => {
    try {
        let repaymentExists = await db.FundraiserRepayment.findOne({
            where: {
                id: repaymentId,
                fundraiserId: user?.id,
            },
        });

        if (!repaymentExists) {
            return {
                status: false,
                code: 404,
                msg: "Repayment record not found.",
            };
        }

        if (!user?.accountType) {
            return {
                status: false,
                code: 401,
                msg: "Please Choose account type to perform this action.",
            };
        }

        if (user?.accountType !== accountType?.fundraiser) {
            return {
                status: false,
                code: 401,
                msg: "You do not have the necessary role permissions to perform this action.",
            };
        }

        if (!user?.isKybVerified) {
            return {
                status: false,
                code: 400,
                msg: "Please Complete Your KYB.",
            };
        }

        let campaignExists = await db.Campaign.findOne({
            where: { userId: user?.id },
        });

        if (!campaignExists) {
            return {
                status: false,
                code: 404,
                msg: "Campaign not found for this user.",
            };
        }

        // if (campaignExists?.campaignStatus !== campaignStatus?.SUCCESSFUL &&
        //     campaignExists?.campaignStatus !== campaignStatus?.UNSUCCESSFUL
        // ) {
        //     return {
        //         status: false, code: 400,
        //         msg: `You can pay installment only when campaign status is either 'successful' or 'unsuccessful'.`
        //     }
        // }

        const currentDate = moment.utc();
        const campaignEndDate = moment.utc(campaignExists?.campaignEndDate);

        if (campaignEndDate.isAfter(currentDate)) {
            return {
                status: false,
                code: 400,
                msg: "You can only pay installments after the campaign has ended.",
            };
        }

        const allowedInstallmentDate = campaignEndDate.add(5, 'days');

        if (currentDate.isBefore(allowedInstallmentDate)) {
            return {
                status: false,
                code: 400,
                msg: "You can pay installments only after 5 days from the campaign's end date.",
            };
        }

        let repaymentSchedules = repaymentExists?.repaymentSchedules || [];
        if (repaymentSchedules?.length === 0) {
            return {
                status: false, code: 400, msg: "Repayment Schedules not exists for this record."
            }
        }

        const installment = repaymentExists?.repaymentSchedules.find(
            (installment) => installment.id === installmentId
        );

        if (!installment) {
            return {
                status: false,
                code: 404,
                msg: "Given installment not found.",
            };
        }

        if (installment && installment?.paymentStatus !== paymentStatus?.PENDING) {
            return {
                status: false, code: 400,
                msg: `You can only pay installments that are marked as pending.`
            }
        }

        let isNearstInstalmentMatch = isMatchedInstallmentNextDue(installment, repaymentSchedules)

        if (!isNearstInstalmentMatch) {
            return {
                status: false, code: 400,
                msg: `You can only pay installments that are already due or the next one in line. Please make sure all previous installments are either paid or already due before proceeding with the next payment.`
            }
        }

        let currencyRates = null;
        currencyRates = await db.Currency.findOne({});
        if (!currencyRates) {
            let response = await currencyService.addOrUpdateCurrencyRates();
            if (!response?.status) {
                return response;
            }
            currencyRates = response?.data;
        }

        let transactionPayload = {
            userId: user?.id,
            transactionStatus: transactionStatus?.PENDING,
            currency: currencies?.OMR,
            transactionAmount: installment?.installmentAmount,
            transactionType: transactionType?.REPAYMENT,
            campaignId: campaignExists?.id,
            installmentId: installment?.id
        };

        transactionPayload["ratePerUSD"] = currencyRates?.rates[currencies?.OMR];
        transactionPayload["amountToPayInUSD"] = installment?.installmentAmount;
        transactionPayload["remainingAmount"] = installment?.installmentAmount;

        let paymentURLResult = await transactionService.createPaymobPayment({
            user,
            transactionPayload,
            items: [
				{
					name: `Repay_${moment().unix()}`,
					amount: Math.round((transactionPayload?.transactionAmount * 1000).toString()),
					description: `Repay_${moment().unix()}`,
					quantity: "1"
				}
			]
        });

        return paymentURLResult;

    } catch (error) {
        console.error("Error while create reg fee checkout url:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

const isMatchedInstallmentNextDue = (matchedInstallment, allRepayments) => {
    const currentDate = moment.utc().format();

    // Sort all installments by due date
    const sortedInstallments = allRepayments.sort(
        (a, b) => moment.utc(a.dueDate).format() - moment.utc(b.dueDate).format()
    );

    // Find the nearest next due installment
    const nearestNextInstallment = sortedInstallments.find(installment =>
        moment.utc(installment.dueDate).format() > currentDate &&
        installment.paymentStatus === paymentStatus?.PENDING
    );

    // Ensure all previous installments are either paid or already due
    const arePreviousInstallmentsCleared = sortedInstallments.every(installment => {
        const installmentDueDate = moment.utc(installment.dueDate).format();
        let nearestNextInstallmentDueDate = moment.utc(nearestNextInstallment?.dueDate).format();

        if (installmentDueDate < nearestNextInstallmentDueDate) {
            // if installment paid and due before nearest/upcomming installment and has paidOn key
            // OR
            // if installment pending and due before or same current date
            let result = ((installment.paymentStatus === paymentStatus?.SUCCESSFUL &&
                installmentDueDate < nearestNextInstallmentDueDate &&
                installment.hasOwnProperty("paidOn")
            ) || (installment.paymentStatus === paymentStatus?.PENDING &&
                installmentDueDate < currentDate)
            );
            return result
        }
        // If the installment due date is not before the nearest next installment, skip it
        return true;
    });

    // Check if the matched installment is the nearest next due installment
    if (matchedInstallment?.paymentStatus === paymentStatus?.PENDING &&
        moment.utc(matchedInstallment.dueDate).format() < currentDate
    ) {
        return (
            nearestNextInstallment && arePreviousInstallmentsCleared
        );
    } else {
        return (
            nearestNextInstallment &&
            nearestNextInstallment.id === matchedInstallment.id &&
            arePreviousInstallmentsCleared
        );
    }
};

module.exports = payInstallment;
