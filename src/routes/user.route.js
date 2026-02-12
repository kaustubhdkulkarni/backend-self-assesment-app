const express = require("express");
const userControllers = require("../modules/users/controllers");
const validate = require("../middlewares/validate");
const userValidation = require("../modules/users/user.validations");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");
const router = express.Router();

const { sharedRateLimiter } = require("../middlewares/rateLimiter");

router
  .route("/register")
  .post(
    sharedRateLimiter,
    checkContentType(contentType.applicationJSON),
    validate(userValidation.registerUser),
    userControllers.registerUser
  );

router
  .route("/")
  .get(auth(roleAccess.backofficeUser), userControllers.getAllUsers);

router
  .route("/export")
  .get(
    auth([roleAccess.user], "Dashboard", "main"),
    userControllers.exportUsers
  );

router
  .route("/dashboard-summary")
  .get(
    auth([roleAccess.user], "Dashboard", "main"),
    userControllers.getAllCount
  );

router
  .route("/")
  .put(
    sharedRateLimiter,
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(userValidation.updateUser),
    userControllers.updateUser
  );

router
  .route("/login")
  .post(
    sharedRateLimiter,
    checkContentType(contentType.applicationJSON),
    validate(userValidation.loginUser),
    userControllers.loginUser
  );

router
  .route("/get-current-user")
  .get(auth(roleAccess.user), userControllers.getCurrentUser);

router
  .route("/get-profile-info")
  .get(auth(roleAccess.user), userControllers.userProfileInfo);

router
  .route("/check-users-details-completed/:userId")
  .get(
    auth([roleAccess.user], "Users", "main"),
    userControllers.checkUserDetailsCompleted
  );

router
  .route("/get-userById/:userId")
  .get(
    auth([roleAccess.user], "Users", "main"),
    validate(userValidation.getUserByIdForAdmin),
    userControllers.getUserByIdForAdmin
  );

router
  .route("/get-userinfo/:userId")
  .get(
    auth([roleAccess.user], "Profile Details", "main"),
    validate(userValidation.getUserInfo),
    userControllers.getUserInfoById
  );

router
  .route("/get-all-users")
  .get(auth(roleAccess.superAdmin), userControllers.getAllUsersList);

router
  .route("/send-feedback-email")
  .post(
    sharedRateLimiter,
    checkContentType(contentType.applicationJSON),
    validate(userValidation.sendFeedBackEmail),
    userControllers.sendFeedBackEmail
  );

  router
    .route("/update-user/:id")
    .patch(
        auth(roleAccess.superAdmin),
        validate(userValidation.updateUserProfileByAdmin),
        userControllers.updateUserProfileByAdmin
    );

  router
    .route("/delete-account")
    .post(
        validate(userValidation.deleteUser),
        userControllers.deleteUser
    );

module.exports = router;
