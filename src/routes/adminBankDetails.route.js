const express = require('express');
const bankDetailControllers = require('../modules/AdminBankDetails/controllers');
const validate = require("../middlewares/validate");
const bankDetailValidation = require("../modules/AdminBankDetails/adminBankDetails.validation");
const auth = require('../middlewares/auth');
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');
const router = express.Router();

router.route('/').post(
	auth(roleAccess.superAdmin),
	checkContentType(contentType.applicationJSON),
	validate(bankDetailValidation.addAdminBank),
	bankDetailControllers.addAdminBank
);

router.route('/get-my-banks').get(
	auth(roleAccess.superAdmin),
	bankDetailControllers.getMyBanks
);

router.route('/:bankId').put(
	auth(roleAccess.superAdmin),
	checkContentType(contentType.applicationJSON),
	validate(bankDetailValidation.updateBank),
	bankDetailControllers.updateBank
);

router.route('/:bankId').delete(
	auth(roleAccess.superAdmin),
	validate(bankDetailValidation.deleteBank),
	bankDetailControllers.deleteBank
);

router.route('/get-primary-bank').get(
	auth(roleAccess.user),
	bankDetailControllers.getPrimaryBank
);


module.exports = router;
