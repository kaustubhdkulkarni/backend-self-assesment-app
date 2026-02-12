const Joi = require('joi');

const sendOtpForVerification = {
	body: Joi.object({
		phoneNumber: Joi.string().trim().pattern(/^\+?([1-9]\d{0,2})(\d{10,12})$/).required().messages({
			'string.pattern.base': `Phone number field must be a valid phone number with at least 11 digits with country code.`,
			'any.required': `The 'phone number' field is required. Please include it in your request.`
		}),
		email: Joi.string().trim().email().required().messages({
			'string.email': `The 'email' field must be a valid email address.`,
			'any.required': `The 'email' field is required. Please include it in your request.`,
			'string.empty': `The 'email' field cannot be empty. Please provide a valid email address.`,
		}),
	}),
};
const sendOtpForEmailVerification = {
	body: Joi.object({
		email: Joi.string().trim().email().required().messages({
			'string.email': `The 'email' field must be a valid email address.`,
			'any.required': `The 'email' field is required. Please include it in your request.`,
			'string.empty': `The 'email' field cannot be empty. Please provide a valid email address.`,
		}),
	}),
};

const verifyOtpPhone = {
	body: Joi.object({
		phoneNumber: Joi.string().trim().pattern(/^\+?([1-9]\d{0,2})(\d{10,12})$/).required().messages({
			'string.pattern.base': `Phone number field must be a valid phone number with at least 11 digits with country code.`,
			'any.required': `The 'phone number' field is required. Please include it in your request.`
		}),
		email: Joi.string().trim().email().required().messages({
			'string.email': `The 'email' field must be a valid email address.`,
			'any.required': `The 'email' field is required. Please include it in your request.`,
			'string.empty': `The 'email' field cannot be empty. Please provide a valid email address.`,
		}),
		otpCode: Joi.number().integer().min(100000).max(999999).required().messages({
			'number.base': `OTP code must be a numeric value.`,
			'number.integer': `OTP code must be an integer.`,
			'number.min': `OTP code must be 6 digit long and cannot be negative.`,
			'number.max': `OTP code must be 6 digit long and cannot be negative.`,
			'any.required': `The 'OTP' field is required. Please include it in your request.`
		}),
	}),
};

const verifyOTPEmailAccount = {
	body: Joi.object({
		email: Joi.string().trim().email().required().messages({
			'string.email': `The 'email' field must be a valid email address.`,
			'any.required': `The 'email' field is required. Please include it in your request.`,
			'string.empty': `The 'email' field cannot be empty. Please provide a valid email address.`,
		}),
		otpCode: Joi.number().integer().min(100000).max(999999).required().messages({
			'number.base': `OTP code must be a numeric value.`,
			'number.integer': `OTP code must be an integer.`,
			'number.min': `OTP code must be 6 digit long and cannot be negative.`,
			'number.max': `OTP code must be 6 digit long and cannot be negative.`,
			'any.required': `The 'OTP' field is required. Please include it in your request.`
		}),
	}),
};

const getExpiryByPhone = {
	body: Joi.object({
		phoneNumber: Joi.string().trim().pattern(/^\+?([1-9]\d{0,2})(\d{10,12})$/).required().messages({
			'string.pattern.base': `Phone number field must be a valid phone number with at least 11 digits with country code.`,
			'any.required': `The 'phone number' field is required. Please include it in your request.`
		}),
		email: Joi.string().trim().email().required().messages({
			'string.email': `The 'email' field must be a valid email address.`,
			'any.required': `The 'email' field is required. Please include it in your request.`,
			'string.empty': `The 'email' field cannot be empty. Please provide a valid email address.`,
		}),
	}),
};
const getExpiryByEmail = {
	params: Joi.object({
		email: Joi.string().trim().email().required().messages({
			'string.email': `The 'email' field must be a valid email address.`,
			'any.required': `The 'email' field is required. Please include it in your request.`,
			'string.empty': `The 'email' field cannot be empty. Please provide a valid email address.`,
		}),
	}),
};

const getSignContractOtpExpiry = {
    params: Joi.object().keys({
        investmentId: Joi.string().uuid().required()
    })
};

module.exports = {
	sendOtpForVerification,
	verifyOtpPhone,
	getExpiryByPhone,
	verifyOTPEmailAccount,
	sendOtpForEmailVerification,
	getExpiryByEmail,
	getSignContractOtpExpiry 
}