const express = require("express");
const notificationControllers = require("../modules/notification/controllers");
const validate = require("../middlewares/validate");
const notificationValidation = require("../modules/notification/notification.validations");
const auth = require("../middlewares/auth");
const router = express.Router();
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");

router
  .route("/get-my-notification")
  .get(auth(roleAccess.user), notificationControllers.getMyNotifications);

router
  .route("/mark-notification-read/:notificationId")
  .put(
    auth(roleAccess.user),
    validate(notificationValidation.markNotificationReadValidation),
    notificationControllers.updateNotificationIsRead
  );

//For admin
router
  .route("/send-notification")
  .post(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(notificationValidation.notificationValidation),
    notificationControllers.sendNotification
  );

router
  .route("/get-allnotifications")
  .get(
    auth([roleAccess.user], "Notifications", "main"),
    notificationControllers.getAllNotifications
  );

module.exports = router;
