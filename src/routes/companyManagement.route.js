const express = require("express");
const companyManagementControllers = require("../modules/companyManagement/controllers");
const validate = require("../middlewares/validate");
const companyManagementValidation = require("../modules/companyManagement/companyManagement.validations");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");
const router = express.Router();

// Sophisticated Investor
router
  .route("/sophisticated-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(
      companyManagementValidation.addSophisticatedInvestorCompanyManagement
    ),
    companyManagementControllers.addSophisticatedInvestorCompanyManagement
  );
router
  .route("/sophisticated-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(
      companyManagementValidation.updateSophisticatedInvestorCompanyManagement
    ),
    companyManagementControllers.updateSophisticatedInvestorCompanyManagement
  );
router
  .route("/sophisticated-investor")
  .get(
    auth(roleAccess.user),
    companyManagementControllers.getSophisticatedInvestorCompanyManagement
  );

// Business Investor
router
  .route("/business-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(companyManagementValidation.addBusinessInvestorCompanyManagement),
    companyManagementControllers.addBusinessInvestorCompanyManagement
  );
router
  .route("/business-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(
      companyManagementValidation.updateBusinessInvestorCompanyManagement
    ),
    companyManagementControllers.updateBusinessInvestorCompanyManagement
  );
router
  .route("/business-investor")
  .get(
    auth(roleAccess.user),
    companyManagementControllers.getBusinessInvestorCompanyManagement
  );

// Fundraiser
router
  .route("/fundraiser")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(companyManagementValidation.addFundraiserCompanyManagement),
    companyManagementControllers.addFundraiserCompanyManagement
  );
router
  .route("/fundraiser")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(companyManagementValidation.updateFundraiserCompanyManagement),
    companyManagementControllers.updateFundraiserCompanyManagement
  );
router
  .route("/fundraiser")
  .get(
    auth(roleAccess.user),
    companyManagementControllers.getFundraiserCompanyManagement
  );

//admin update
router
  .route("/fundraiser-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(
      companyManagementValidation.updateFundraiserCompanyManagementByAdmin
    ),
    companyManagementControllers.updateFundraiserCompanyManagementByAdmin
  );
router
  .route("/fundraiser-admin/:userId")
  .post(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(
      companyManagementValidation.updateFundraiserCompanyManagementByAdmin
    ),
    companyManagementControllers.updateFundraiserCompanyManagementByAdmin
  );

module.exports = router;
