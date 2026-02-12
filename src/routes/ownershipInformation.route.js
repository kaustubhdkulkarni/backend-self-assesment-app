const express = require('express');
const ownershipInformationController = require('../modules/ownershipInformation/controller');
const validate = require("../middlewares/validate");
const ownershipInformationValidation = require("../modules/ownershipInformation/ownershipInformation.validations");
const auth = require('../middlewares/auth');
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');
const router = express.Router();

// Business Investor
router.route('/business-investor').post(
	auth(roleAccess.user),
	checkContentType(contentType.applicationJSON),
	validate(ownershipInformationValidation.addBusinessInvestorOwnershipInfo),
	ownershipInformationController.addBusinessInvestorOwnershipInfo
);
router.route('/business-investor').put(
	auth(roleAccess.user),
	checkContentType(contentType.applicationJSON),
	validate(ownershipInformationValidation.updateBusinessInvestorOwnershipInfo),
	ownershipInformationController.updateBusinessInvestorOwnershipInfo
);
router.route('/business-investor').get(
	auth(roleAccess.user),
	ownershipInformationController.getBusinessInvestorOwnershipInfo
);
router.route('/business-investor-admin/:userId').put(
	auth(roleAccess.superAdmin),
	checkContentType(contentType.applicationJSON),
	validate(ownershipInformationValidation.updateBusinessInvestorOwnershipInfoByAdmin),
	ownershipInformationController.updateBusinessInvestorOwnershipInfoByAdmin
);


module.exports = router;