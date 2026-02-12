const Joi = require("joi");
const { accountType, gender } = require("../../config/enums");
const validateEmailDomain = require("../../utilities/emailDomainValidator");

const today = new Date();
today.setHours(0, 0, 0, 0);

const eighteenYearsAgo = new Date(today);
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const registerUser = {
	body: Joi.object({
		firstName: Joi.string().trim().required().messages({
			"string.empty": `The 'first name' field is required and cannot be empty. Please provide a valid first name.`,
			"any.required": `The 'first name' field is required. Please include it in your request.`,
		}),
		middleName: Joi.string().trim().required().messages({
			"string.empty": `The 'middle name' field is required and cannot be empty. Please provide a valid middle name.`,
			"any.required": `The 'middle name' field is required. Please include it in your request.`,
		}),
		lastName: Joi.string().trim().required().messages({
			"string.empty": `The 'last name' field is required and cannot be empty. Please provide a valid last name.`,
			"any.required": `The 'last name' field is required. Please include it in your request.`,
		}),
		phone: Joi.string()
			.trim()
			.pattern(/^\+?([1-9]\d{0,2})(\d{10,12})$/)
			.required()
			.messages({
				"string.pattern.base": `The 'phone number' field must be a valid phone number with at least 11 digits with country code.`,
				"any.required": `The 'phone number' field is required. Please include it in your request.`,
				"string.empty": `The 'phone number' field cannot be empty. Please provide a valid phone number.`,
			}),
		email: Joi.string().trim().email().required().custom(validateEmailDomain).messages({
			"string.email": `The 'email' field must be a valid email address.`,
			"any.required": `The 'email' field is required. Please include it in your request.`,
			"string.empty": `The 'email' field cannot be empty. Please provide a valid email address.`,
		}),
		dateOfBirth: Joi.date()
			.iso()
			.less(today) // Use today without time
			.max(eighteenYearsAgo) // Use date without time
			.required()
			.messages({
				"date.base": `The 'birth date' field must be a valid date.`,
				"date.less": `The 'birth date' field must be a date in the past.`,
				"date.max": `The 'birth date' field must be at least 18 years ago from today.`,
				"any.required": `The 'birth date' field is required. Please include it in your request.`,
			}),
		gender: Joi.string()
			.trim()
			.valid(...Object.values(gender))
			.messages({
				"string.empty": `The 'gender' field is required and cannot be empty. Please provide a valid gender.`,
				"any.only": `The 'gender' field must be one of ${Object.values(
					gender
				).join(", ")}.`,
			}),
		password: Joi.string().trim().min(8).required().messages({
			"string.min": `The 'password' field must be at least 8 characters long.`,
			"any.required": `The 'password' field is required. Please include it in your request.`,
			"string.empty": `The 'password' field cannot be empty. Please provide a valid password.`,
		}),
		accountType: Joi.string()
			.trim()
			.valid(...Object.values(accountType))
			.required()
			.messages({
				"any.only": `The 'account type' field must be one of the following: ${Object.values(
					accountType
				).join(", ")}.`,
				"any.required": `The 'account type' field is required. Please include it in your request.`,
				"string.empty": `The 'account type' field cannot be empty. Please provide a valid account type.`,
			}),
		civilNumber: Joi.string()
			.trim()
			.pattern(/^[a-zA-Z0-9]+$/)
			.optional()
			.messages({
				"string.empty": `The 'civil number' field cannot be empty. Please provide a valid civil number.`,
				"string.pattern.base": `The 'civil number' field must not have special characters.`,
			}),
	}),
};

const loginUser = {
	body: Joi.object({
		email: Joi.string().trim().email().required().messages({
			"string.empty": `The 'email' field cannot be empty. Please provide a valid email address.`,
			"string.email": `Email must be a valid email address.`,
			"any.required": `The 'email' field is required. Please include it in your request.`,
		}),
		password: Joi.string().trim().required().messages({
			"any.required": `The 'password' field is required. Please include it in your request.`,
		}),
	}),
};

const updateUser = {
	body: Joi.object({
		firstName: Joi.string().trim().optional().messages({
			"string.empty": `The 'first name' field cannot be empty. Please provide a valid first name.`,
		}),
		middleName: Joi.string().trim().optional().messages({
			"string.empty": `The 'middle name' field is required and cannot be empty. Please provide a valid middle name.`,
		}),
		lastName: Joi.string().trim().optional().messages({
			"string.empty": `The 'last name' field cannot be empty. Please provide a valid last name.`,
		}),
		dateOfBirth: Joi.date()
			.iso()
			.less(new Date())
			.max(eighteenYearsAgo)
			.optional()
			.messages({
				"date.base": `The 'birth date' field must be a valid date.`,
				"date.less": `The 'birth date' field must be a date in the past.`,
				"date.max": `The 'birth date' field must be at least 18 years ago from today.`,
			}),
		gender: Joi.string()
			.trim()
			.valid(...Object.values(gender))
			.messages({
				"string.empty": `The 'gender' field cannot be empty. Please provide a valid gender.`,
				"any.only": `The 'gender' field must be one of ${Object.values(
					gender
				).join(", ")}.`,
			}),
		subRoleId: Joi.string()
			.trim()
			.guid({ version: "uuidv4" })
			.optional()
			.messages({
				"string.empty": `The 'sub role id' field cannot be empty. Please provide a valid subRoleId.`,
				"string.guid": `The 'sub role id' must be a valid UUID.`,
			}),
		civilNumber: Joi.string()
			.trim()
			.pattern(/^[a-zA-Z0-9]+$/)
			.optional()
			.messages({
				"string.empty": `The 'civil number' field cannot be empty. Please provide a valid civil number.`,
				"string.pattern.base": `The 'civil number' field must not have special characters.`,
			}),
	}),
};

const getUserByIdForAdmin = {
	params: Joi.object({
		userId: Joi.string()
			.trim()
			.guid({ version: "uuidv4" })
			.required()
			.messages({
				"string.empty": 'The "User Id" field cannot be empty.',
				"string.guid": 'The "User Id" must be a valid UUID.',
				"any.required":
					'The "User Id" field is required. Please include it in your request.',
			}),
	}),
};
const getUserInfo = {
	params: Joi.object({
		userId: Joi.string()
			.trim()
			.guid({ version: "uuidv4" })
			.required()
			.messages({
				"string.empty": 'The "User Id" field cannot be empty.',
				"string.guid": 'The "User Id" must be a valid UUID.',
				"any.required":
					'The "User Id" field is required. Please include it in your request.',
			}),
	}),
};

const sendFeedBackEmail = {
	body: Joi.object({
		name: Joi.string().trim().min(2).max(50).required().messages({
			"string.empty": 'The "Name" field cannot be empty.',
			"string.min": 'The "Name" must be at least 2 characters long.',
			"string.max": 'The "Name" cannot exceed 50 characters.',
			"any.required": 'The "Name" field is required.',
		}),
		email: Joi.string().trim().email().required().messages({
			"string.empty": 'The "Email" field cannot be empty.',
			"string.email": 'The "Email" must be a valid email address.',
			"any.required": 'The "Email" field is required.',
		}),
		message: Joi.string().trim().max(500).required().messages({
			"string.empty": 'The "Message" field cannot be empty.',
			"string.min": 'The "Message" must be at least 10 characters long.',
			"string.max": 'The "Message" cannot exceed 500 characters.',
			"any.required": 'The "Message" field is required.',
		}),
		phone: Joi.string()
			.trim()
			.pattern(/^\+?[1-9]\d{1,14}$/)
			.required()
			.messages({
				"string.empty": 'The "Phone" field cannot be empty.',
				"string.pattern.base":
					'The "Phone" number must be a valid international format.',
				"any.required": 'The "Phone" field is required.',
			}),
	}),
};

const updateUserProfileByAdmin = {
	params: Joi.object({
		id: Joi.string()
			.trim()
			.uuid({ version: ["uuidv4", "uuidv5"] })
			.required()
			.messages({
				"string.guid": `'User ID' must be a valid UUID.`,
				"string.empty": `'User ID' field cannot be empty.`,
				"any.required": `The 'User ID' field is required.`,
			}),
	}),

	body: Joi.object({
		firstName: Joi.string()
			.trim()
			.min(2)
			.max(80)
			.optional()
			.messages({
				"string.min": `First Name must be at least 2 characters long.`,
				"string.max": `'First Name' must not exceed 80 characters.`,
			}),

		middleName: Joi.string()
			.trim()  // ✅ No parameter needed
			.min(2)  // Add min if you want minimum length
			.max(80)
			.allow("", null)
			.optional()
			.messages({
				"string.min": `Middle Name must be at least 2 characters long.`,
				"string.max": `Middle Name must not exceed 80 characters.`,
			}),

		lastName: Joi.string()
			.trim()
			.min(2)
			.max(80)
			.optional()
			.messages({
				"string.min": `'Last Name' must be at least 2 characters long.`,
				"string.max": `'Last Name' must not exceed 80 characters.`,
			}),

		phone: Joi.string()
			.trim()
			.pattern(/^\+?([1-9]\d{0,2})(\d{10,12})$/)
			.optional()
			.messages({
				"string.pattern.base": `The 'phone number' field must be a valid phone number with at least 11 digits with country code.`,
				"any.required": `The 'phone number' field is required. Please include it in your request.`,
				"string.empty": `The 'phone number' field cannot be empty. Please provide a valid phone number.`,
			}),

		dateOfBirth: Joi.date()
			.iso()
			.less(new Date())
			.max(eighteenYearsAgo)
			.optional()
			.messages({
				"date.base": `The 'birth date' field must be a valid date.`,
				"date.less": `The 'birth date' field must be a date in the past.`,
				"date.max": `The 'birth date' field must be at least 18 years ago from today.`,
			}),

		gender: Joi.string()
			.trim()
			.valid(...Object.values(gender))
			.optional()
			.messages({
				"string.empty": `The 'gender' field cannot be empty. Please provide a valid gender.`,
				"any.only": `The 'gender' field must be one of ${Object.values(
					gender
				).join(", ")}.`,
			}),

		civilNumber: Joi.string()
			.trim()
			.pattern(/^[a-zA-Z0-9]+$/)
			.optional()
			.messages({
				"string.empty": `The 'civil number' field cannot be empty. Please provide a valid civil number.`,
				"string.pattern.base": `The 'civil number' field must not have special characters.`,
			}),

		active: Joi.boolean()
			.optional()
			.messages({
				"boolean.base": `'Active' must be a boolean value.`,
			}),

		isAccountLocked: Joi.boolean()
			.optional()
			.messages({
				"boolean.base": `'Account Locked' must be a boolean value.`,
			}),

		isMobileVerified: Joi.boolean()
			.optional()
			.messages({
				"boolean.base": `'Mobile Verified' must be a boolean value.`,
			}),

		isEmailVerified: Joi.boolean()
			.optional()
			.messages({
				"boolean.base": `'Email Verified' must be a boolean value.`,
			}),

		isKycVerified: Joi.boolean()
			.optional()
			.messages({
				"boolean.base": `'KYC Verified' must be a boolean value.`,
			}),

		isKybVerified: Joi.boolean()
			.optional()
			.messages({
				"boolean.base": `'KYB Verified' must be a boolean value.`,
			}),
	})
		.min(1)
		.messages({
			"object.min": `At least one field must be provided to update.`,
		}),
};


const deleteUser = {
	body: Joi.object({
		email: Joi.string().trim().email().required().messages({
			"string.empty": `The 'email' field cannot be empty.`,
			"string.email": `Please provide a valid email address.`,
			"any.required": `The 'email' field is required.`,
		}),

		password: Joi.string().trim().min(8).required().messages({
			"string.empty": `The 'password' field cannot be empty.`,
			"string.min": `The 'password' must be at least 8 characters long.`,
			"any.required": `The 'password' field is required.`,
		}),

		reason: Joi.string().trim().min(5).max(300).required().messages({
			"string.empty": `The 'reason' field cannot be empty.`,
			"string.min": `The 'reason' must be at least 5 characters long.`,
			"string.max": `The 'reason' cannot exceed 300 characters.`,
			"any.required": `The 'reason' field is required.`,
		}),
	}),
};


module.exports = {
	registerUser,
	loginUser,
	updateUser,
	getUserByIdForAdmin,
	getUserInfo,
	sendFeedBackEmail,
	updateUserProfileByAdmin,
	deleteUser
};
