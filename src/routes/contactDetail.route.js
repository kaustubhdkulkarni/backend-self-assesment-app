const express = require("express");
const contactDetailControllers = require("../modules/contactDetails/controllers");
const validate = require("../middlewares/validate");
const contactDetailValidation = require("../modules/contactDetails/contactDetails.validation");
const auth = require("../middlewares/auth");
const router = express.Router();
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");

// Regular Investor
router
  .route("/investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(contactDetailValidation.addContactDetails),
    contactDetailControllers.addContactDetail
  );

router
  .route("/investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(contactDetailValidation.updateContactDetails),
    contactDetailControllers.updateContactDetail
  );
router
  .route("/investor")
  .get(
    auth(roleAccess.user),
    contactDetailControllers.getInvestorContactDetail
  );
router
  .route("/investor-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(contactDetailValidation.updateInvestorContactDetailsByAdmin),
    contactDetailControllers.updateInvestorContactDetailsByAdmin
  );

// Sophisticated Investor
router
  .route("/sophisticated-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(contactDetailValidation.addSophisticatedInvestorContactDetails),
    contactDetailControllers.addSophisticatedInvestorContactDetails
  );
router
  .route("/sophisticated-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(contactDetailValidation.updateSophisticatedInvestorContactDetails),
    contactDetailControllers.updateSophisticatedInvestorContactDetails
  );
router
  .route("/sophisticated-investor")
  .get(
    auth(roleAccess.user),
    contactDetailControllers.getSophisticatedInvestorContactDetails
  );
router
  .route("/sophisticated-investor-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(
      contactDetailValidation.updateSophisticatedInvestorContactDetailsByAdmin
    ),
    contactDetailControllers.updateSophisticatedInvestorContactDetailsByAdmin
  );

// Business Investor
router
  .route("/business-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(contactDetailValidation.addBusinessInvestorContactDetails),
    contactDetailControllers.addBusinessInvestorContactDetails
  );
router
  .route("/business-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(contactDetailValidation.updateBusinessInvestorContactDetails),
    contactDetailControllers.updateBusinessInvestorContactDetails
  );
router
  .route("/business-investor")
  .get(
    auth(roleAccess.user),
    contactDetailControllers.getBusinessInvestorContactDetails
  );
router
  .route("/business-investor-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(
      contactDetailValidation.updateBusinessInvestorContactDetailsByAdmin
    ),
    contactDetailControllers.updateBusinessInvestorContactDetailsByAdmin
  );

// Fundraiser
router
  .route("/fundraiser")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(contactDetailValidation.addContactDetailsFundraiser),
    contactDetailControllers.addFundraiserContactDetail
  );
router
  .route("/fundraiser")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(contactDetailValidation.updateContactDetailsFundraiser),
    contactDetailControllers.updateFundraiserContactDetail
  );
router
  .route("/fundraiser")
  .get(
    auth(roleAccess.user),
    contactDetailControllers.getFundraiserContactDetail
  );

//admin update
router
  .route("/fundraiser-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(contactDetailValidation.updateFundraiserContactDetailsByAdmin),
    contactDetailControllers.updateFundraiserContactDetailsByAdmin
  );
router
  .route("/fundraiser-admin/:userId")
  .post(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(contactDetailValidation.updateFundraiserContactDetailsByAdmin),
    contactDetailControllers.updateFundraiserContactDetailsByAdmin
  );

module.exports = router;
