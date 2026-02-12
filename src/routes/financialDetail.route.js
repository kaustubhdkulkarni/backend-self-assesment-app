const express = require("express");
const financialDetailControllers = require("../modules/financialDetails/controlles");
const validate = require("../middlewares/validate");
const financialDetailValidation = require("../modules/financialDetails/financialDetails.validations");
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
    validate(financialDetailValidation.addSophisticatedInvestorFinancialDetail),
    financialDetailControllers.addSophisticatedInvestorFinancialDetail
  );
router
  .route("/sophisticated-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(
      financialDetailValidation.updateSophisticatedInvestorFinancialDetail
    ),
    financialDetailControllers.updateSophisticatedInvestorFinancialDetail
  );
router
  .route("/sophisticated-investor")
  .get(
    auth(roleAccess.user),
    financialDetailControllers.getSophisticatedInvestorFinancialDetail
  );

// Business Investor
router
  .route("/business-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(financialDetailValidation.addBusinessInvestorFinancialDetail),
    financialDetailControllers.addBusinessInvstorFinancialDetail
  );
router
  .route("/business-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(financialDetailValidation.updateBusinessInvestorFinancialDetail),
    financialDetailControllers.updateBusinessInvestorFinancialDetail
  );
router
  .route("/business-investor")
  .get(
    auth(roleAccess.user),
    financialDetailControllers.getBusinessInvestorFinancialDetail
  );

// Fundraiser
router
  .route("/fundraiser")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(financialDetailValidation.addFundraiserFinancialDetail),
    financialDetailControllers.addFundraiserFinancialDetail
  );
router
  .route("/fundraiser")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(financialDetailValidation.updateFundraiserFinancialDetail),
    financialDetailControllers.updateFundraiserFinancialDetail
  );
router
  .route("/fundraiser")
  .get(
    auth(roleAccess.user),
    financialDetailControllers.getFundraiserFinancialDetail
  );

//admin update
router
  .route("/fundraiser-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(financialDetailValidation.updateFundraiserFinancialDetailsByAdmin),
    financialDetailControllers.updateFundraiserFinancialDetailsByAdmin
  );
router
  .route("/fundraiser-admin/:userId")
  .post(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(financialDetailValidation.updateFundraiserFinancialDetailsByAdmin),
    financialDetailControllers.updateFundraiserFinancialDetailsByAdmin
  );

module.exports = router;
