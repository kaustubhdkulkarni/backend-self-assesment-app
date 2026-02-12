const { transactionStatus, transactionType, accountType } = require('../../../config/enums');
const { db } = require('../../../db/db');
const currencyService = require("../../currencies/services")
const transactionService = require("../services")
const moment = require('moment');

const addFundsTransaction = async ({ user, body }) => {
	try {
		if (!user?.accountType) {
			return {
				status: false, code: 401, msg: "Please Choose account type to perform this action."
			}
		}
		if (user?.accountType !== accountType?.investor) {
			return {
				status: false, code: 401, msg: "You do not have the necessary role permissions to perform this action."
			}
		}
		let transactionPayload = {
			userId: user?.id,
			transactionStatus: transactionStatus?.PENDING,
			currency: body?.currency,
			transactionAmount: body?.transactionAmount,
			transactionType: transactionType?.ADD_FUNDS,
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

		if (currencyRates?.rates) {
			let rates = currencyRates?.rates;
			const usdToOmrRate = rates["OMR"];
			if (rates[body?.currency] && usdToOmrRate) {
				const amountInUSD = Number((body?.transactionAmount / rates[body?.currency]).toFixed(3));
				const amountInOMR = Number((amountInUSD * usdToOmrRate).toFixed(3));

				transactionPayload["ratePerUSD"] = usdToOmrRate;
				transactionPayload["amountToPayInUSD"] = amountInOMR;
				transactionPayload["remainingAmount"] = amountInOMR;
			}
		}

		let paymentURLResult = await transactionService.createPaymobPayment({
			user,
			transactionPayload,
			items: [
				{
					name: `AddFund_${moment().unix()}`,
					amount: (body?.transactionAmount * 1000).toString(),
					description: `AddFund_${moment().unix()}`,
					quantity: "1"
				}
			]
		})
		return paymentURLResult;
	} catch (error) {
		console.error("Error while create add funds checkout url:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = addFundsTransaction;