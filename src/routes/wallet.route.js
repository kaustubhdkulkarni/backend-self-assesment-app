const express = require('express');
const walletControllers = require('../modules/wallet/controllers');
const validate = require("../middlewares/validate");
const walletValidation = require("../modules/wallet/wallet.validation");
const auth = require('../middlewares/auth');
const { roleAccess } = require('../config/enums');
const router = express.Router();


// router.route('/update-wallet-funds').post(
// 	// auth(roleAccess.user),
// 	validate(walletValidation.addOrUpdateFundsToUserWallet),
// 	walletControllers.addOrUpdateFundsToUserWallet
// );
router.route('/').get(
	auth(roleAccess.user),
	walletControllers.getUserBalance
);

router.route('/get-all-wallets').get(
	auth(roleAccess.admin),
	walletControllers.getAllWalletsByAdmin
);

module.exports = router;