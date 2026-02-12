const express = require("express");
const generalInformationControllers = require("../modules/generalInformation/controllers");
const validate = require("../middlewares/validate");
const generalInformationValidation = require("../modules/generalInformation/generalInformation.validations");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");
const router = express.Router();

// Regular Investor
router
  .route("/investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(generalInformationValidation.addInvestorGeneralInfo),
    generalInformationControllers.addInvestorGeneralInfo
  );
router
  .route("/investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(generalInformationValidation.updateInvestorGeneralInfo),
    generalInformationControllers.updateInvestorGeneralInfo
  );
router
  .route("/investor")
  .get(
    auth(roleAccess.user),
    generalInformationControllers.getInvestorGeneralInfo
  );
router
  .route("/investor-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(generalInformationValidation.updateInvestorGeneralInfoByAdmin),
    generalInformationControllers.updateInvestorGeneralInfoByAdmin
  );

// Sophisticated Investor
router
  .route("/sophisticated-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(generalInformationValidation.addSophisticatedInvestorGeneralInfo),
    generalInformationControllers.addSophisticatedInvestorGeneralInfo
  );
router
  .route("/sophisticated-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(
      generalInformationValidation.updateSophisticatedInvestorGeneralInfo
    ),
    generalInformationControllers.updateSophisticatedInvestorGeneralInfo
  );
router
  .route("/sophisticated-investor")
  .get(
    auth(roleAccess.user),
    generalInformationControllers.getSophisticatedInvestorGeneralInfo
  );
router
  .route("/sophisticated-investor-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(
      generalInformationValidation.updateSophisticatedInvestorGeneralInfoByAdmin
    ),
    generalInformationControllers.updateSophisticatedInvestorGeneralInfoByAdmin
  );

// Business Investor
router
  .route("/business-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(generalInformationValidation.addBusinessInvestorGeneralInfo),
    generalInformationControllers.addBusinessInvestorGeneralInfo
  );
router
  .route("/business-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(generalInformationValidation.updateBusinessInvestorGeneralInfo),
    generalInformationControllers.updateBusinessInvestorGeneralInfo
  );
router
  .route("/business-investor")
  .get(
    auth(roleAccess.user),
    generalInformationControllers.getBusinessInvestorGeneralInfo
  );
router
  .route("/business-investor-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(generalInformationValidation.updateBusinessInvestorGeneralInfo),
    generalInformationControllers.updateBusinessInvestorGeneralInfoByAdmin
  );

// Fundraiser
router
  .route("/fundraiser")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(generalInformationValidation.addFundraiserGeneralInfo),
    generalInformationControllers.addFundRaiserGeneralInfo
  );

router
  .route("/fundraiser")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(generalInformationValidation.updateFundraiserGeneralInfo),
    generalInformationControllers.updateFundRaiserGeneralInfo
  );
router
  .route("/fundraiser")
  .get(
    auth(roleAccess.user),
    generalInformationControllers.getFundraiserGeneralInfo
  );
router
  .route("/fundraiser-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(generalInformationValidation.updateFundraiserGeneralInfoByAdmin),
    generalInformationControllers.updateFundraiserGeneralInfoByAdmin
  );
router
  .route("/fundraiser-admin/:userId")
  .post(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(generalInformationValidation.updateFundraiserGeneralInfoByAdmin),
    generalInformationControllers.updateFundraiserGeneralInfoByAdmin
  );

module.exports = router;
