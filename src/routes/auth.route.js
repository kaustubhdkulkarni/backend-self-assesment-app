const express = require("express");
const authControllers = require("../modules/auth/auth.controllers");
const tokenServices = require("../modules/tokens/tokens.services");
const validate = require("../middlewares/validate");
const authValidation = require("../modules/auth/auth.validations");
const userValidation = require("../modules/users/user.validations");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");
const router = express.Router();

router
  .route("/renew-token")
  .post(
    checkContentType(contentType.applicationJSON),
    validate(authValidation.renewToken),
    authControllers.renewToken
  );
router
  .route("/verify-email")
  .get(
    validate(authValidation.verifyEmail),
    authControllers.verifyEmailController
  );
router
  .route("/resend-verification-email")
  .post(
    checkContentType(contentType.applicationJSON),
    validate(authValidation.resendVerificationEmail),
    authControllers.resendEmailController
  );

router
  .route("/register-admin")
  .post(
    checkContentType(contentType.applicationJSON),
    validate(authValidation.registerAdmin),
    authControllers.registerAdmin
  );

  router.route('/create-backoffice-user').post(
	checkContentType(contentType.applicationJSON),
	auth(roleAccess?.superAdmin),
	validate(authValidation.createBackofficeUser),
	authControllers.createBackofficeUser
);

router
  .route("/update-system-user-role-permissions/:roleId")
  .patch(
    checkContentType(contentType.applicationJSON),
    authControllers.updateSystemUserRole
  );

router
  .route("/login-admin")
  .post(
    checkContentType(contentType.applicationJSON),
    validate(authValidation.loginAdmin),
    authControllers.loginAdmin
  );

router
  .route("/forgot-password")
  .post(
    checkContentType(contentType.applicationJSON),
    validate(authValidation.forgotPassword),
    authControllers.forgotPassword
  );

router
  .route("/verify-forgot-password-token/:token")
  .get(authControllers.verifyForgotPasswordToken);

router
  .route("/reset-user-password/:token")
  .post(
    checkContentType(contentType.applicationJSON),
    validate(authValidation.resetUserPassword),
    authControllers.resetUserPassword
  );

module.exports = router;
