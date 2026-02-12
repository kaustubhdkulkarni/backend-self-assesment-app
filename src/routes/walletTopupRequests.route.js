const express = require("express");
const walletTopupRequestsControllers = require("../modules/walletTopupRequests/controllers");
const validate = require("../middlewares/validate");
const walletTopupRequestsValidation = require("../modules/walletTopupRequests/walletTopupRequests.validation");
const auth = require("../middlewares/auth");
const { roleAccess } = require("../config/enums");
const router = express.Router();

router
  .route("/create")
  .post(
    auth(roleAccess.user),
    validate(walletTopupRequestsValidation.addWalletTopupRequest),
    walletTopupRequestsControllers.addWalletTopupRequest
  );
router
  .route("/reject/:id")
  .post(
    auth([roleAccess.user], "Wallet Topup Requests", "main"),
    validate(walletTopupRequestsValidation.rejectOrRefundWalletTopupRequest),
    walletTopupRequestsControllers.rejectWalletTopupRequest
  );
router
  .route("/refund/:id")
  .post(
    auth([roleAccess.user], "Wallet Topup Requests", "main"),
    validate(walletTopupRequestsValidation.rejectOrRefundWalletTopupRequest),
    walletTopupRequestsControllers.refundWalletTopupRequest
  );
router
  .route("/approve/:id")
  .post(
    auth([roleAccess.user], "Wallet Topup Requests", "main"),
    validate(walletTopupRequestsValidation.approveWalletTopupRequest),
    walletTopupRequestsControllers.approveWalletTopupRequest
  );
router
  .route("/")
  .get(
    auth(roleAccess.user),
    walletTopupRequestsControllers.getMyWalletTopupRequests
  );
router
  .route("/all")
  .get(
    auth([roleAccess.user], "Wallet Topup Requests", "main"),
    walletTopupRequestsControllers.getAllWalletTopupRequests
  );
router
  .route("/:id")
  .get(
    auth([roleAccess.user], "Wallet Topup Requests", "main"),
    validate(walletTopupRequestsValidation.getWalletTopupRequestById),
    walletTopupRequestsControllers.getWalletTopupRequestById
  );

// router.route('/get-all-wallets').get(
// 	auth(roleAccess.admin),
// 	walletTopupRequestsControllers.getAllWalletsByAdmin
// );

module.exports = router;
