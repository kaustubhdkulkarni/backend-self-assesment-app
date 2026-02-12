const express = require("express");
const commercialInfoControllers = require("../modules/commercialInformation/controllers");
const validate = require("../middlewares/validate");
const commercialInfoValidation = require("../modules/commercialInformation/commercialInformation.validations");
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
    validate(commercialInfoValidation.addSophisticatedInvestorCommercialInfo),
    commercialInfoControllers.addSophisticatedInvestorCommercialInfo
  );
router
  .route("/sophisticated-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(
      commercialInfoValidation.updateSophisticatedInvestorCommercialInfo
    ),
    commercialInfoControllers.updateSophisticatedInvestorCommercialInfo
  );
router
  .route("/sophisticated-investor")
  .get(
    auth(roleAccess.user),
    commercialInfoControllers.getSophisticatedInvestorCommercialInfo
  );

// Business Investor
router
  .route("/business-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(commercialInfoValidation.addBusinessInvestorCommercialInfo),
    commercialInfoControllers.addBusinessInvestorCommercialInfo
  );
router
  .route("/business-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(
      commercialInfoValidation.updateSophisticatedInvestorCommercialInfo
    ),
    commercialInfoControllers.updateBusinessInvestorCommercialInfo
  );
router
  .route("/business-investor")
  .get(
    auth(roleAccess.user),
    commercialInfoControllers.getBusinessInvestorCommercialInfo
  );

// Fundraiser
router
  .route("/fundraiser")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(commercialInfoValidation.addFundraiserCommercialInfo),
    commercialInfoControllers.addFundraiserCommercialInfo
  );
router
  .route("/fundraiser")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(commercialInfoValidation.updateFundraiserCommercialInfo),
    commercialInfoControllers.updateFundraiserCommercialInfo
  );
router
  .route("/fundraiser")
  .get(
    auth(roleAccess.user),
    commercialInfoControllers.getFundraiserCommercialInfo
  );

//admin update
router
  .route("/fundraiser-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(commercialInfoValidation.updateFundraiserCommercialInfoByAdmin),
    commercialInfoControllers.updateFundraiserCommercialInfoByAdmin
  );
router
  .route("/fundraiser-admin/:userId")
  .post(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(commercialInfoValidation.updateFundraiserCommercialInfoByAdmin),
    commercialInfoControllers.updateFundraiserCommercialInfoByAdmin
  );

module.exports = router;
