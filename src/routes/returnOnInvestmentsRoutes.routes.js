const express = require('express');
const returnOnInvestmentsController = require('../modules/returnOnInvestment/controllers/index');
const validate = require("../middlewares/validate");
const returnOnInvestmentsValidation = require("../modules/returnOnInvestment/returnOnInvestment.validations");
const auth = require('../middlewares/auth');
const router = express.Router();
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');

router.route('/add').post(
	auth(roleAccess.superAdmin),
	checkContentType(contentType.applicationJSON),
	validate(returnOnInvestmentsValidation.addReturnOnInvestment),
	returnOnInvestmentsController.addReturnOnInvestment
);

router.route('/get-all-roi').get(
	auth(roleAccess.admin),
	returnOnInvestmentsController.getAllReturnOnInvestment
);

router.route('/get-my-roi').get(
	auth(roleAccess.user),
	returnOnInvestmentsController.getMyReturnOnInvestment
);

module.exports = router;
