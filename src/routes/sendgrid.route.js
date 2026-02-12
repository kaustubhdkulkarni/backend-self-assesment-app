const express = require("express");
const sendgridControllers = require("../modules/sendgrid/controllers");
const validate = require("../middlewares/validate");
const sendgridValidation = require("../modules/sendgrid/sendgrid.validations");
const auth = require("../middlewares/auth");
const router = express.Router();
const { roleAccess } = require("../config/enums");

// Get daily email statistics (last X days)
router
  .route("/stats/daily")
  .get(
    auth(roleAccess.superAdmin),
    validate(sendgridValidation.getDailyStats),
    sendgridControllers.getDailySurpassedEmails
  );

// Get suppression data (bounces, spam, unsubscribes, etc.)
router
  .route("/suppressions")
  .get(
    auth(roleAccess.superAdmin),
    sendgridControllers.getSuppressionData
  );

// Get email activity (sent, delivered, failed emails with reasons)
router
  .route("/activity")
  .get(
   // auth(roleAccess.superAdmin),
    validate(sendgridValidation.getEmailActivity),
    sendgridControllers.getEmailActivity
  );

// Get detailed failed emails for a specific period
router
  .route("/failed-emails")
  .get(
   // auth(roleAccess.superAdmin),
    validate(sendgridValidation.getFailedEmails),
    sendgridControllers.getFailedEmails
  );

module.exports = router;
