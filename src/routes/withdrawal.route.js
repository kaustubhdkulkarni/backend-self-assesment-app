const express = require('express');
const withdrawalControllers = require('../modules/withdrawals/controllers');
const validate = require("../middlewares/validate");
const withdrawalValidation = require("../modules/withdrawals/withdrawal.validations");
const auth = require('../middlewares/auth');
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');
const router = express.Router();

//user
router.route('/send-withdraw-request').post(
	auth(roleAccess.user),
	checkContentType(contentType.applicationJSON),
	validate(withdrawalValidation.sendWithdrawRequest),
	withdrawalControllers.sendWithdrawRequest
);

router.route('/my-withdrawals').get(
	auth(roleAccess.user),
	withdrawalControllers.getWithdrawalHistory
);

//admin
router.route('/get-withdraw-requests').get(
	auth(roleAccess.admin),
	withdrawalControllers.getWithdrawrequestForAdmin
);

router.route('/get-withdrawRequest/:requestId').get(
	auth(roleAccess.superAdmin),
	validate(withdrawalValidation.getRequestById),
	withdrawalControllers.getWithdrawalById
);

router.route('/approve-request/:requestId').put(
	auth(roleAccess.superAdmin),
	validate(withdrawalValidation.approveWithdrawalRequest),
	withdrawalControllers.approveWithdrawalRequest
);

router.route('/reject-request/:requestId').put(
	auth(roleAccess.superAdmin),
	checkContentType(contentType.applicationJSON),
	validate(withdrawalValidation.rejectWithdrawalRequest),
	withdrawalControllers.rejectWithdrawalRequest
);

module.exports = router;