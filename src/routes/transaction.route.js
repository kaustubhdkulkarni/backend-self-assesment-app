const express = require("express");
const transactionControllers = require("../modules/transactions/controllers");
const validate = require("../middlewares/validate");
const transactionValidation = require("../modules/transactions/transaction.validation");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");
const router = express.Router();

router
  .route("/add-funds")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(transactionValidation.addFundsTransaction),
    transactionControllers.addFundsTransaction
  );

router
  .route("/pay-campaign-reg-fee")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(transactionValidation.createCampaignRegFeeTrnx),
    transactionControllers.createCampaignRegFeeTrnx
  );

router
  .route("/")
  .get(auth(roleAccess.user), transactionControllers.getMyTransactions);

router
  .route("/get-all-transactions")
  .get(
    auth([roleAccess.user], "Transactions", "main"),
    transactionControllers.getAllTransactions
  );

router
  .route("/verify/:checkoutSessionId")
  .get(auth(roleAccess.user), transactionControllers.verifyTransaction);

router
  .route(`/pay-installment/:installmentId`)
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(transactionValidation.payInstallment),
    transactionControllers.payInstallment
  );

module.exports = router;
