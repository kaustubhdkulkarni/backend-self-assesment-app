const express = require('express');
const currencyControllers = require('../modules/currencies/controllers');
const validate = require("../middlewares/validate");
const currencyValidation = require("../modules/currencies/currency.validation");
const auth = require('../middlewares/auth');
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');
const router = express.Router();

router.route('/').post(
    auth(roleAccess.superAdmin),
    currencyControllers.addOrUpdateCurrencyRates
);
router.route('/').get(
	auth(roleAccess.user),
	currencyControllers.getCurrencyRates
);

module.exports = router;