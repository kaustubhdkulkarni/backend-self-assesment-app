const Joi = require('joi');

const getDailyStats = {
  query: Joi.object().keys({
    days: Joi.number().integer().min(1).max(90).default(10).messages({
      'number.base': 'Days must be a number',
      'number.min': 'Days must be at least 1',
      'number.max': 'Days cannot exceed 90'
    })
  })
};

const getSuppressionData = {
  query: Joi.object().keys({
    days: Joi.number().integer().min(1).max(365).messages({
      'number.base': 'Days must be a number',
      'number.min': 'Days must be at least 1',
      'number.max': 'Days cannot exceed 365'
    }),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).messages({
      'string.pattern.base': 'Date must be in YYYY-MM-DD format'
    })
  }).custom((value, helpers) => {
    // Ensure only one of days or date is provided
    if (value.days && value.date) {
      return helpers.error('object.xor', { 
        message: 'Provide either days or date parameter, not both' 
      });
    }
    return value;
  })
};

const getEmailActivity = {
  query: Joi.object().keys({
    days: Joi.number().integer().min(1).max(30).default(1).messages({
      'number.base': 'Days must be a number',
      'number.min': 'Days must be at least 1',
      'number.max': 'Days cannot exceed 30'
    })
  })
};

const getFailedEmails = {
  query: Joi.object().keys({
    days: Joi.number().integer().min(1).max(30).default(1).messages({
      'number.base': 'Days must be a number',
      'number.min': 'Days must be at least 1',
      'number.max': 'Days cannot exceed 30'
    }),
    status: Joi.string().valid('bounce', 'blocked', 'dropped', 'invalid', 'spam', 'all').default('all').messages({
      'string.base': 'Status must be a string',
      'any.only': 'Status must be one of: bounce, blocked, dropped, invalid, spam, all'
    })
  })
};

module.exports = {
  getDailyStats,
  getSuppressionData,
  getEmailActivity,
  getFailedEmails
};
