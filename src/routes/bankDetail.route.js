const express = require("express");
const bankDetailControllers = require("../modules/bankDetails/controllers");
const validate = require("../middlewares/validate");
const bankDetailValidation = require("../modules/bankDetails/bankDetails.validation");
const auth = require("../middlewares/auth");
const router = express.Router();
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");

// Sophisticated Investor
router
  .route("/sophisticated-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(bankDetailValidation.addSophisticatedInvestorBankDetail),
    bankDetailControllers.addSophisticatedInvestorBankDetail
  );
router
  .route("/sophisticated-investor")
  .get(
    auth(roleAccess.user),
    bankDetailControllers.getSophisticatedInvestorBankDetail
  );
router
  .route("/sophisticated-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(bankDetailValidation.updateSophisticatedInvestorBankDetail),
    bankDetailControllers.updateSophisticatedInvestorBankDetail
  );

// Business Investor
router
  .route("/business-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(bankDetailValidation.addBusinessInvestorBankDetail),
    bankDetailControllers.addBusinessInvestorBankDetail
  );
router
  .route("/business-investor")
  .get(
    auth(roleAccess.user),
    bankDetailControllers.getBusinessInvestorBankDetail
  );
router
  .route("/business-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(bankDetailValidation.updateBusinessInvestorBankDetail),
    bankDetailControllers.updateBusinessInvestorBankDetail
  );

// Fundraiser
router
  .route("/fundraiser")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(bankDetailValidation.addFundraiserBankDetails),
    bankDetailControllers.addFundraiserBankDetails
  );
router
  .route("/fundraiser")
  .get(auth(roleAccess.user), bankDetailControllers.getFundraiserBankDetail);
router
  .route("/fundraiser")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(bankDetailValidation.updateFundraiserBankDetails),
    bankDetailControllers.updateFundraiserBankDetails
  );

//admin update
router
  .route("/fundraiser-admin/:userId")
  .put(
    auth([roleAccess.user], "Campaigns", "main"),
    checkContentType(contentType.applicationJSON),
    validate(bankDetailValidation.updateFundraiserBankDetailsByAdmin),
    bankDetailControllers.updateFundraiserBankDetailsByAdmin
  );
router
  .route("/fundraiser-admin/:userId")
  .post(
    auth([roleAccess.user], "Campaigns", "main"),
    checkContentType(contentType.applicationJSON),
    validate(bankDetailValidation.updateFundraiserBankDetailsByAdmin),
    bankDetailControllers.updateFundraiserBankDetailsByAdmin
  );

module.exports = router;
