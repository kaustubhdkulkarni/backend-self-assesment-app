const Joi = require('joi');
const { notificationTypes } = require('../../config/enums');

const notificationValidation = {
  body: Joi.object({
    userId: Joi.string().guid({ version: ['uuidv4'] }).required().messages({
      'string.guid': `The 'userId' must be a valid UUID.`,
      'any.required': `The 'userId' field is required.`,
      'string.empty': `The 'userId' field cannot be empty. Please provide a valid userId.`,
    }),
    message: Joi.string().trim().required().messages({
      'string.empty': `The 'message' field cannot be empty. Please provide a valid message.`,
      'any.required': `The 'message' field is required. Please include it in your request.`,
    }),
    notificationType: Joi.string().valid(...Object.values(notificationTypes)).required().messages({
      'any.only': `The 'notificationType' field must be one of ${Object.values(notificationTypes).join(', ')}.`,
      'any.required': `The 'notificationType' field is required.`,
      'string.empty': `The 'notificationType' field cannot be empty. Please provide a valid notification type.`,
    }),
  }),
};


const markNotificationReadValidation = {
	params: Joi.object({
		notificationId: Joi.string().trim().guid({ version: 'uuidv4' }).required().messages({
			'string.empty': 'The "Notification Id" field cannot be empty.',
			'string.guid': 'The "Notification Id" must be a valid UUID.',
			'any.required': 'The "Notification Id" field is required. Please include it in your request.',
		}),
	})
}

module.exports = {
    notificationValidation,
    markNotificationReadValidation
};
