const express = require("express");
const investmentControllers = require("../modules/investments/controllers");
const validate = require("../middlewares/validate");
const investmentValidation = require("../modules/investments/investment.validation");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");
const router = express.Router();

router
  .route("/")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(investmentValidation.addInvestment),
    investmentControllers.addInvestment
  );
router
  .route("/")
  .get(auth(roleAccess.user), investmentControllers.getFundingHistory);
router
  .route("/get-my-investment")
  .get(auth(roleAccess.user), investmentControllers.getMyInvestment);

router
  .route("/get-all-investment")
  .get(auth(roleAccess.admin), investmentControllers.getAllInvestment);

router
  .route("/send-otp-for-investment")
  .post(auth(roleAccess.user), investmentControllers.sendOtpForInvestment);

router
  .route("/verify-investment-otp")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(investmentValidation.verifyInvestmentOtp),
    investmentControllers.verifyInvestmentOtp
  );
router
  .route("/cancle-investment")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(investmentValidation.cancleInvestment),
    investmentControllers.cancleInvestment
  );

router
  .route("/send-sign-contract-otp/:investmentId")
  .post(auth(roleAccess.user), investmentControllers.sendSignContractOtp);

router
  .route("/verify-sign-contract-otp/:investmentId")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(investmentValidation.verifySignContractOtp),
    investmentControllers.verifySignContractOtp
  );

router
  .route("/update-repayment-date/:investmentId")
  .put(
    auth([roleAccess.user], "Investment", "main"),
    checkContentType(contentType.applicationJSON),
    validate(investmentValidation.updateRepaymentDate),
    investmentControllers.updateRepaymentDate
  );

router
  .route("/export-investment")
  .get(
    auth([roleAccess.user], "Investment", "main"),
    investmentControllers.exportInvestments
  );
router
  .route("/get-investors-list")
  .get(
    auth([roleAccess.user], "Investment", "main"),
    investmentControllers.getInvestorsList
  );

router
  .route("/get-investment-stats")
  .get(
    auth([roleAccess.user], "Investment", "main"),
    investmentControllers.getInvestnentStats
  );

router
  .route("/get-individual-investment-stats")
  .get(
    auth(roleAccess.user),
    investmentControllers.getIndividualInvestmentStats
  );

router
  .route("/update-investment-status-and-contract")
  .get(
    auth(roleAccess.superAdmin),
    investmentControllers.updateInvestmentStatus
  );

module.exports = router;
