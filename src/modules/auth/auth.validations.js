const Joi = require('joi');
const { gender, roles } = require('../../config/enums');
const validateEmailDomain = require('../../utilities/emailDomainValidator');

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const renewToken = {
    body: Joi.object({
        refreshToken: Joi.string().trim().required().messages({
            'string.base': `Refresh token must be a string.`,
            'string.empty': `Refresh token cannot be empty.`,
            'any.required': `Refresh token is required.`
        }),
    }),
};

const verifyEmail = {
    query: Joi.object({
        token: Joi.string().trim().required().messages({
            'string.base': `Token must be a string.`,
            'string.empty': `Token cannot be empty.`,
            'any.required': `Token is required.`
        }),
    }),
};

const resendVerificationEmail = {
	body: Joi.object({
        token: Joi.string().trim().required().messages({
            'string.base': `Token must be a string.`,
            'string.empty': `Token cannot be empty.`,
            'any.required': `Token is required.`
        }),
    }),
}
const forgotPassword = {
	body: Joi.object({
        email: Joi.string().trim().required().messages({
            'string.base': `Email must be a string.`,
            'string.empty': `Email cannot be empty.`,
            'any.required': `Email is required.`
        }),
    }),
}
const resetUserPassword = {
	params: Joi.object({
        token: Joi.string().trim().required().messages({
            'string.base': `Token must be a string.`,
            'string.empty': `Token cannot be empty.`,
            'any.required': `Token is required.`
        }),
    }),
	body: Joi.object({
        password: Joi.string().trim().required().messages({
            'string.base': `password must be a string.`,
            'string.empty': `Password cannot be empty.`,
            'any.required': `Password is required.`
        }),
    }),
}

const registerAdmin = {
	body: Joi.object({
		firstName: Joi.string().trim().required().messages({
			'string.empty': `The 'first name' field is required and cannot be empty. Please provide a valid first name.`,
			'any.required': `The 'first name' field is required. Please include it in your request.`,
		}),
		middleName: Joi.string().trim().required().messages({
			'string.empty': `The 'middle name' field is required and cannot be empty. Please provide a valid middle name.`,
			'any.required': `The 'middle name' field is required. Please include it in your request.`,
		}),
		lastName: Joi.string().trim().required().messages({
			'string.empty': `The 'last name' field is required and cannot be empty. Please provide a valid last name.`,
			'any.required': `The 'last name' field is required. Please include it in your request.`,
		}),
		phone: Joi.string().trim().pattern(/^\+?([1-9]\d{0,2})(\d{10,12})$/).required().messages({
			'string.pattern.base': `The 'phone number' field must be a valid phone number with at least 11 digits with country code.`,
			'any.required': `The 'phone number' field is required. Please include it in your request.`,
			'string.empty': `The 'phone number' field cannot be empty. Please provide a valid phone number.`,
		}),
		email: Joi.string().trim().email().required().custom(validateEmailDomain).messages({
			'string.email': `The 'email' field must be a valid email address.`,
			'any.required': `The 'email' field is required. Please include it in your request.`,
			'string.empty': `The 'email' field cannot be empty. Please provide a valid email address.`,
		}),
		dateOfBirth: Joi.date().iso().less(new Date()).max(eighteenYearsAgo).required().messages({
			'date.base': `The 'birth date' field must be a valid date.`,
			'date.less': `The 'birth date' field must be a date in the past.`,
			'date.max': `The 'birth date' field must be at least 18 years ago from today.`,
			'any.required': `The 'birth date' field is required. Please include it in your request.`,
		}),
		gender: Joi.string().trim().valid(...Object.values(gender)).messages({
			'string.empty': `The 'gender' field is required and cannot be empty. Please provide a valid gender.`,
			'any.only': `The 'gender' field must be one of ${Object.values(gender).join(", ")}.`,
		}),
		password: Joi.string().trim().min(8).pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/).required().messages({
			'string.min': `The 'password' field must be at least 8 characters long.`,
			'string.pattern.base': `The 'password' field must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.`,
			'any.required': `The 'password' field is required. Please include it in your request.`,
			'string.empty': `The 'password' field cannot be empty. Please provide a valid password.`,
		}),
	}),
};


const createBackofficeUser = {
	body: Joi.object({
		firstName: Joi.string().trim().required().messages({
			'string.empty': `The 'first name' field is required and cannot be empty. Please provide a valid first name.`,
			'any.required': `The 'first name' field is required. Please include it in your request.`,
		}),
		middleName: Joi.string().trim().required().messages({
			'string.empty': `The 'middle name' field is required and cannot be empty. Please provide a valid middle name.`,
			'any.required': `The 'middle name' field is required. Please include it in your request.`,
		}),
		lastName: Joi.string().trim().required().messages({
			'string.empty': `The 'last name' field is required and cannot be empty. Please provide a valid last name.`,
			'any.required': `The 'last name' field is required. Please include it in your request.`,
		}),
		systemUserRoleId: Joi.string().guid({ version: ['uuidv4', 'uuidv5'] }).required().messages({
			'string.guid': `The 'system user role ID' must be a valid UUID (v4 or v5).`,
			'string.empty': `The 'system user role ID' field cannot be empty. Please provide a valid UUID.`,
			'any.required': `The 'system user role ID' field is mandatory. Please include it in your request.`,
		}),				
		phone: Joi.string().trim().pattern(/^\+?([1-9]\d{0,2})(\d{10,12})$/).required().messages({
			'string.pattern.base': `The 'phone number' field must be a valid phone number with at least 11 digits with country code.`,
			'any.required': `The 'phone number' field is required. Please include it in your request.`,
			'string.empty': `The 'phone number' field cannot be empty. Please provide a valid phone number.`,
		}),
		email: Joi.string().trim().email().required().messages({
			'string.email': `The 'email' field must be a valid email address.`,
			'any.required': `The 'email' field is required. Please include it in your request.`,
			'string.empty': `The 'email' field cannot be empty. Please provide a valid email address.`,
		}),
		dateOfBirth: Joi.date().iso().less(new Date()).max(eighteenYearsAgo).required().messages({
			'date.base': `The 'birth date' field must be a valid date.`,
			'date.less': `The 'birth date' field must be a date in the past.`,
			'date.max': `The 'birth date' field must be at least 18 years ago from today.`,
			'any.required': `The 'birth date' field is required. Please include it in your request.`,
		}),
		gender: Joi.string().trim().valid(...Object.values(gender)).messages({
			'string.empty': `The 'gender' field is required and cannot be empty. Please provide a valid gender.`,
			'any.only': `The 'gender' field must be one of ${Object.values(gender).join(", ")}.`,
		}),
		password: Joi.string().trim().min(8).required().messages({
			'string.min': `The 'password' field must be at least 8 characters long.`,
			'string.pattern.base': `The 'password' field must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.`,
			'any.required': `The 'password' field is required. Please include it in your request.`,
			'string.empty': `The 'password' field cannot be empty. Please provide a valid password.`,
		}),
		role: Joi.string().trim().valid(...[roles?.admin, roles?.backofficeUser]).required().messages({
			'string.empty': `The 'role' field is required and cannot be empty. Please provide a valid role.`,
			'any.required': `The 'role' field is required. Please include it in your request.`,
			'any.only': `The 'role' field must be one of ${[roles?.admin, roles?.backofficeUser].join(", ")}.`,
		}),
	}),
};


const loginAdmin = {
	body: Joi.object({
		email: Joi.string().trim().email().required().messages({
			'string.email': `Email must be a valid email address.`,
			'any.required': `The 'email' field is required. Please include it in your request.`
		}),
		password: Joi.string().trim().required().messages({
			'any.required': `The 'password' field is required. Please include it in your request.`
		})
	})
};

module.exports = {
    renewToken, verifyEmail,
    registerAdmin, loginAdmin,
	createBackofficeUser,
	resendVerificationEmail,
	forgotPassword,
	resetUserPassword
};
