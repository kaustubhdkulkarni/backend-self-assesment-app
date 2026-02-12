const Joi = require("joi")
const { transactionType, allowedCurrencies, currencies } = require("../../config/enums")

const addFundsTransaction = {
	body: Joi.object({
		currency: Joi.string().trim().valid(...[currencies?.OMR]).required().messages({
			'string.empty': 'The "Currency" field cannot be empty.',
			'any.required': `The 'Currency' field is required. Please include it in your request.`,
			'any.only': `The 'Currency' field must be one of ${[currencies?.OMR].join(", ")}.`,
		}),
		transactionAmount: Joi.number().min(1).required().messages({
			'number.base': `The 'Transaction Amount' field must be a number.`,
			'number.min': `The 'Transaction Amount' field must be greater than 0.`,
			'any.required': `The 'Transaction Amount' field is required. Please include it in your request.`,
		})
	})
}
const createCampaignRegFeeTrnx = {
	body: Joi.object({
		notificationId: Joi.string().trim().guid({ version: 'uuidv4' }).messages({
			'string.empty': 'The "Notification Id" field cannot be empty.',
			'string.guid': 'The "Notification Id" must be a valid UUID.',
			'any.required': 'The "Notification Id" field is required. Please include it in your request.',
		}),
	})
}

const getTransactionByid = {
    params: Joi.object({
		transactionId: Joi.string().trim().guid({ version: 'uuidv4' }).required().messages({
			'string.empty': 'The "Transaction Id" field cannot be empty.',
			'string.guid': 'The "Transaction Id" must be a valid UUID.',
			'any.required': 'The "Transaction Id" field is required. Please include it in your request.',
		}),
	}),
};

const payInstallment = {
	params: Joi.object({
		installmentId: Joi.string().trim().guid({ version: 'uuidv4' }).required().messages({
			'string.empty': 'The "InstallmentId Id" field cannot be empty.',
			'string.guid': 'The "InstallmentId Id" must be a valid UUID.',
			'any.required': 'The "InstallmentId Id" field is required. Please include it in your request.',
		}),
	}),
	body: Joi.object({
		repaymentId: Joi.string().trim().guid({ version: 'uuidv4' }).required().messages({
			'string.empty': 'The "repaymentId" field cannot be empty.',
			'string.guid': 'The "repaymentId" must be a valid UUID.',
			'any.required': 'The "repaymentId" field is required. Please include it in your request.',
		}),
	}),
};

module.exports = {
	addFundsTransaction,
	createCampaignRegFeeTrnx,
	getTransactionByid,
	payInstallment
}