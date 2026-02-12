const getDailySurpassedEmails = require('./getDailySurpassedEmails.controller');
const getSuppressionData = require('./getSuppressionData.controller');
const getEmailActivity = require('./getEmailActivity.controller');
const getFailedEmails = require('./getFailedEmails.controller');

module.exports = {
  getDailySurpassedEmails,
  getSuppressionData,
  getEmailActivity,
  getFailedEmails
};
