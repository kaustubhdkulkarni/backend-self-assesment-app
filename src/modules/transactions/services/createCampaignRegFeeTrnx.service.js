const {
	transactionStatus,
	transactionType,
	accountType,
	notificationTypes,
	campaignStatus,
	currencies
} = require('../../../config/enums');
const { db, Op } = require('../../../db/db');
const currencyService = require("../../currencies/services")
const transactionService = require("../services")
const moment = require("moment")

const createCampaignRegFeeTrnx = async ({ user, notificationId }) => {
	try {
		let notificationExists = await db.Notification.findOne({
			id: notificationId,
			userId: user?.id,
			notificationType: notificationTypes?.CAMPAIGN_REGISTRATION_FEE
		})
		if (!notificationExists) {
			return {
				status: false, code: 404,
				msg: "Notification not found."
			}
		}
		if (!user?.accountType) {
			return {
				status: false, code: 401,
				msg: "Please Choose account type to perform this action."
			}
		}
		if (user?.accountType !== accountType?.fundraiser) {
			return {
				status: false, code: 401,
				msg: "You do not have the necessary role permissions to perform this action."
			}
		}
		if (!user?.isKybVerified) {
			return {
				status: false, code: 400, msg: "Please Complete Your KYB."
			}
		}
		let campaignExists = await db.Campaign.findOne({ where: { userId: user?.id, campaignStatus: campaignStatus.WAITING_FOR_REGISTRATION_FEE, campaignEndDate: { [Op.is]: null } } })
		if (!campaignExists) {
			return {
				status: false, code: 404,
				msg: "Campaign not found for this user."
			}
		}
		if (campaignExists?.isCampaignRegistrationFeePaid) {
			return {
				status: false, code: 400,
				msg: "Campaign registration fee already paid."
			}
		}
		if (!campaignExists?.isCampaignRegistrationFeePaid && !campaignExists?.campaignRegistrationFee) {
			return {
				status: false, code: 400,
				msg: "Campaign registration fee has not been assigned by the Wadiaa. Please contact the support."
			}
		}

		if (campaignExists?.campaignStatus !== campaignStatus?.WAITING_FOR_REGISTRATION_FEE) {
			return {
				status: false, code: 400,
				msg: `Campaign status must be ${campaignStatus?.WAITING_FOR_REGISTRATION_FEE} to proceed with the campaign registration payment.`
			}
		}

		const repaymentExists = await db.FundraiserRepayment.findOne({
            where: { campaignId: campaignExists?.id, fundraiserId: user?.id }
        });

        if (!repaymentExists) {
            return {
                status: false,
                code: 400,
                msg: "Repayment schedule has not been created for this campaign. Please contact support to set up the repayment plan before proceeding with registration fee payment."
            }
        }

		let transactionPayload = {
			userId: user?.id,
			transactionStatus: transactionStatus?.PENDING,
			currency: currencies?.OMR,
			transactionAmount: campaignExists?.campaignRegistrationFee,
			transactionType: transactionType?.CAMPAIGN_REGISTRATION_FEE,
			campaignId: campaignExists?.id
		}
		let currencyRates = null
		currencyRates = await db.Currency.findOne({})
		if (!currencyRates) {
			let response = await currencyService.addOrUpdateCurrencyRates();
			if (!response?.status) {
				return response;
			}
			currencyRates = response?.data;
		}

		// if (currencyRates?.rates) {
		// 	let rates = currencyRates?.rates;
		// 	if (rates[currencies?.USD]) {
		// 		transactionPayload["ratePerUSD"] = rates[currencies?.USD];
		// 		transactionPayload["amountToPayInUSD"] = Number((campaignExists?.campaignRegistrationFee / rates[currencies?.USD]).toFixed(3));
		// 		transactionPayload["remainingAmount"] = Number((campaignExists?.campaignRegistrationFee / rates[currencies?.USD]).toFixed(3));
		// 	}
		// }

		transactionPayload["ratePerUSD"] = currencyRates?.rates[currencies?.OMR];
		transactionPayload["amountToPayInUSD"] = campaignExists?.campaignRegistrationFee;
		transactionPayload["remainingAmount"] = campaignExists?.campaignRegistrationFee;

		let paymentURLResult = await transactionService.createPaymobPayment({
			user,
			transactionPayload,
			items: [
				{
					name: `CampaignRegFee_${moment().unix()}`,
					amount: (transactionPayload?.transactionAmount * 1000).toString(),
					description: `CampaignRegFee_${moment().unix()}`,
					quantity: "1"
				}
			]
		})
		return paymentURLResult;

	} catch (error) {
		console.error("Error while create reg fee checkout url:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = createCampaignRegFeeTrnx;