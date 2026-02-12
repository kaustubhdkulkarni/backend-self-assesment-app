const {
    transactionStatus,
    currencies,
    transactionType,
    campaignStatus,
    notificationTypes,
    paymentStatus,
} = require("../../../config/enums");
const { db } = require("../../../db/db");
const moment = require("moment");
const { sendNotification } = require("../../notification/services");
const { default: axios } = require("axios");
const { returnOnInvestmentToInvestorAndAdmin } = require("../../returnOnInvestment/services");
const { sendCampaignRegistrationFeeEmailToAdmin, sendCampaignRegistrationFeeEmailToFundraiser, sendInstallmentPaymentEmail } = require("../../../utilities/emailService");
const { getAdminDetails } = require("../../auth/auth.services");
const { addOrUpdateAdminWalletBalance } = require("../../wallet/services");
const logger = require("../../../config/logger");

const verifyPaymobTransaction = async (user, orderId) => {
    try {
        const authResponse = await axios.post(
            `${process.env.PAYMOB_BASE_URL}/v1/api/auth/tokens`,
            {
                api_key: process.env.PAYMOB_API_KEY,
            }
        );
        const authToken = authResponse.data.token;
        const transactionDetail = await db.Transaction.findOne({
            where: {
                userId: user.id,
                transactionSession: orderId,
            },
        });
        if (!transactionDetail) {
            return {
                status: false,
                code: 404,
                msg: "No transaction records found.",
            };
        } else {
            if (
                transactionDetail?.transactionStatus ===
                transactionStatus?.FAILED
            ) {
                return {
                    status: false,
                    code: 400,
                    msg: "Transaction was unsuccessful or has expired.",
                };
            }
            if (
                transactionDetail?.transactionStatus ===
                transactionStatus?.SUCCESSFUL
                // || transactionDetail?.remainingAmount === 0
            ) {
                return {
                    status: true,
                    code: 200,
                    data: "Transaction is already completed.",
                };
            }
            const orderDetailsPayload = {
                order_id: orderId,
            };
            const session = await axios.post(
                `${process.env.PAYMOB_BASE_URL}/api/ecommerce/orders/transaction_inquiry`,
                orderDetailsPayload,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("session:",session);            
            
            if (!session.data) {
                return {
                    status: false,
                    code: 404,
                    msg: "No transaction records found.",
                };
            }

            if (session.data && !session.data?.success) {
                switch (session?.data?.data?.message) {
                    case "AUTHENTICATION_FAILED":
                        return {
                            status: false,
                            code: 400,
                            msg: "Payment failed due to authentication issues. Please check your details and try again.",
                        };
                    case "AUTHENTICATION_UNAVAILABLE":
                        return {
                            status: false,
                            code: 400,
                            msg: "Payment failed due to authentication service being unavailable. Please try again later.",
                        };
                    case "AUTHENTICATION_REJECTED":
                        return {
                            status: false,
                            code: 400,
                            msg: "Payment failed as authentication was rejected by your bank. Please check your details.",
                        };
                    case "AUTHENTICATION_PENDING":
                        return {
                            status: false,
                            code: 400,
                            msg: "Your payment authentication is still pending. Please complete the authentication process or try again later.",
                        };
                    default:
                        return {
                            status: false,
                            code: 400,
                            msg: "Payment failed. Please try again or contact support.",
                        };
                }
            }   

            if (
                transactionDetail?.transactionType ===
                transactionType?.ADD_FUNDS &&
                session?.data &&
                session.data?.success &&
                !session.data?.pending &&
                session?.data?.order?.payment_status &&
                (session?.data?.order?.payment_status).toLocaleLowerCase() === "PAID".toLocaleLowerCase()
            ) {
                logger.info("Add Funds Succeed")

                let updateTransaction = await transactionDetail.update({
                    transactionStatus: transactionStatus.SUCCESSFUL,
                    remainingAmount: 0,
                    transactionResponse: session.data,
                });

                const walletExists = await db.Wallet.findOne({
                    where: { userId: user.id },
                });

                if (walletExists) {
                    await walletExists.increment("balance", {
                        by: transactionDetail.amountToPayInUSD,
                    });
                } else {
                    await db.Wallet.create({
                        currency: currencies.OMR,
                        userId: user.id,
                        balance: transactionDetail.amountToPayInUSD,
                    });
                }

                return {
                    status: true,
                    code: 200,
                    data: "Transaction processed successfully.",
                };
            }
            if (
                transactionDetail?.transactionType ===
                transactionType?.CAMPAIGN_REGISTRATION_FEE &&
                session &&
                session?.data &&
                session.data?.success &&
                !session.data?.pending &&
                session?.data?.order?.payment_status &&
                (session?.data?.order?.payment_status).toLocaleLowerCase() === "PAID".toLocaleLowerCase()
            ) {
                logger.info("Campaign Fee Succeed")

                let updateTransaction = await transactionDetail.update({
                    transactionStatus: transactionStatus.SUCCESSFUL,
                    remainingAmount: 0,
                    transactionResponse: session?.data,
                });

                await addOrUpdateAdminWalletBalance({amount:transactionDetail?.transactionAmount})
                let campaignDetails = await db.Campaign.findOne({
                    where: {
                        userId: user.id,
                        id: transactionDetail.campaignId,
                    },
                });

                const startDate = moment().toDate();
                const endDate = moment(startDate)
                    .add(campaignDetails?.campaignDurationInDays, "days")
                    .toDate();

                if (campaignDetails) {
                    await campaignDetails.update({
                        isCampaignRegistrationFeePaid: true,
                        campaignStatus: campaignStatus.FUNDRAISING_LIVE,
                        campaignStartDate: startDate,
                        campaignEndDate: endDate,
                    });
                }

                const notification = await db.Notification.findOne({
                    where: {
                        userId: user.id,
                        notificationType:
                            notificationTypes?.CAMPAIGN_REGISTRATION_FEE,
                        isRead: false,
                    },
                });

                await notification.update({
                    isRead: true,
                });

                const formattedStartDate =
                    moment(startDate).format("MMMM Do YYYY h:mm:ss a");
                const formattedEndDate = moment(endDate).format("MMMM Do YYYY h:mm:ss a");

                const body = {
                    userId: user.id,
                    message: `Your campaign status is changed to live from ${formattedStartDate} to ${formattedEndDate}`,
                    notificationType: notificationTypes?.CAMPAIGN_STATUS_UPDATE,
                };

                await sendNotification(body);

                const adminDetails = await getAdminDetails();

                await sendCampaignRegistrationFeeEmailToAdmin({ admin: adminDetails?.data, user: user, campaignDetails });
                await sendCampaignRegistrationFeeEmailToFundraiser({ user: user, campaignDetails });

                return {
                    status: true,
                    code: 200,
                    data: "Transaction processed successfully.",
                };
            }
            if (
                transactionDetail?.transactionType === transactionType?.REPAYMENT &&
                session &&
                session?.data &&
                session.data?.success &&
                !session.data?.pending &&
                session?.data?.order?.payment_status &&
                (session?.data?.order?.payment_status).toLocaleLowerCase() === "PAID".toLocaleLowerCase()
            ) {
                logger.info("Repayment Succeed")
                const amountInOMR = session?.data?.amount_cents / 1000;

                let repayment = await db.FundraiserRepayment.findOne({
                    where: {
                        fundraiserId: user.id,
                        campaignId: transactionDetail.campaignId,
                    },
                });                
                if (repayment) {
                    let installment = repayment.repaymentSchedules.find(
                        (inst) =>
                            inst.id === transactionDetail.installmentId &&
                            inst.installmentAmount >= amountInOMR
                    );

                    if (installment) {
                        const installmentAmount = installment.installmentAmount;
                        const principalAmount = installment.principalAmount;
                        const remainingAmount = repayment.remainingAmount - principalAmount;

                        const updatedRepaymentSchedules = repayment.repaymentSchedules.map((inst) => {
                            if (inst.id === installment.id) {
                                return {
                                    ...inst,
                                    paymentStatus: paymentStatus.SUCCESSFUL,
                                    paidOn: moment.utc().format(),
                                };
                            }
                            return inst;
                        });

                        await repayment.update({
                            remainingAmount,
                            repaymentSchedules: updatedRepaymentSchedules,
                        });

                        let campaignId = transactionDetail.campaignId;
                        let returnsToInvestorsAndAdminResult =
                            await returnOnInvestmentToInvestorAndAdmin({
                                campaignId,
                                installmentId: installment.id,
                            });

                        await transactionDetail.update({
                            transactionStatus: transactionStatus.SUCCESSFUL,
                            remainingAmount: 0,
                            transactionResponse: session?.data,
                        });

                        const campaign = await db.Campaign.findOne({
                            where: { id: transactionDetail?.campaignId }
                        })

                        const notificationBody = {
                            userId: user.id,
                            notificationType: notificationTypes.FROM_ADMIN,
                            message: `Your installment payment for the campaign ${campaign?.campaignName} has been successfully processed. Please check your account dashboard for more details.`,
                        };

                        setImmediate(async () => {
                            try {
                                await sendInstallmentPaymentEmail(user, campaign?.campaignName, {
                                    installmentAmount,
                                    remainingAmount,
                                    paidOn: installment.paidOn,
                                });
                                await sendNotification(notificationBody);
                            } catch (error) {
                                console.error("Error while sending email/notification:", error);
                            }
                        });

                        return {
                            status: true,
                            code: 200,
                            data: "Transaction processed successfully.",
                        };
                    }
                }

                return {
                    status: false,
                    code: 400,
                    msg: "Installment not found or invalid amount.",
                };
            }

            if (
                session?.data &&
                session?.data?.data.migs_order.status === "EXPIRED"
            ) {
                let updateTransaction = await transactionDetail.update({
                    transactionStatus: transactionStatus.FAILED,
                    transactionResponse: session?.data,
                });
                return {
                    status: false,
                    code: 400,
                    msg: "The session for this transaction has expired.",
                };
            }
            if (
                session?.data &&
                session?.data?.data.migs_order.status === "PENDING"
            ) {
                let updateTransaction = await transactionDetail.update({
                    transactionStatus: transactionStatus.PENDING,
                    transactionResponse: session?.data,
                });
                return {
                    status: false,
                    code: 400,
                    msg: "Payment for this transaction is pending.",
                };
            }
        }
    } catch (error) {
        console.error("Error while getting transactions  :", error);
        let message = error?.response?.data?.detail && error?.response?.data?.detail !==undefined ? error?.response?.data?.detail : error?.message;
        return { msg: message, status: false, code: 500 };
    }
};

module.exports = verifyPaymobTransaction;
