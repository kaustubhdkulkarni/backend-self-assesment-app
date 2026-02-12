const express = require('express');
const otpControllers = require('../modules/otps/controllers');
const validate = require("../middlewares/validate");
const otpValidation = require("../modules/otps/otp.validations");
const auth = require('../middlewares/auth');
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');
const router = express.Router();

router.route('/send').post(
	checkContentType(contentType.applicationJSON),
	validate(otpValidation.sendOtpForVerification),
	otpControllers.sendOtpForVerification
);
router.route('/send-email-otp').post(
	checkContentType(contentType.applicationJSON),
	validate(otpValidation.sendOtpForEmailVerification),
	otpControllers.sendOTPForVerificationEmail
);
router.route('/verify').post(
	checkContentType(contentType.applicationJSON),
	validate(otpValidation.verifyOtpPhone),
	otpControllers.verifyOtpPhone
);
router.route('/verify-email-account').post(
	checkContentType(contentType.applicationJSON),
	validate(otpValidation.verifyOTPEmailAccount),
	otpControllers.verifyOTPEmailAccount
);
router.route('/get-expiry').post(
	validate(otpValidation.getExpiryByPhone),
	otpControllers.getExpiryByPhone
);
router.route('/get-expiry-email/:email').get(
	validate(otpValidation.getExpiryByEmail),
	otpControllers.getExpiryByEmail
);

router.route('/get-sign-contract-otp-expiry/:investmentId').get(
    auth(),
    validate(otpValidation.getSignContractOtpExpiry),
    otpControllers.getSignContractOtpExpiry
);


module.exports = router;
