const express = require("express");
const documentControllers = require("../modules/documents/controllers");
const validate = require("../middlewares/validate");
const documentValidation = require("../modules/documents/document.validations");
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
    validate(documentValidation.addInvestorDocuments),
    documentControllers.addInvestorDocuments
  );
router
  .route("/investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.updateInvestorDocuments),
    documentControllers.updateInvestorDocuments
  );
router
  .route("/investor")
  .get(auth(roleAccess.user), documentControllers.getInvestorDocuments);
router
  .route("/investor-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.updateRegularInvestorDocumentByAdmin),
    documentControllers.updateRegularInvestorDocumentByAdmin
  );

// Business Investor
router
  .route("/business-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.addBusinessInvestorDocuments),
    documentControllers.addBusinessInvestorDocuments
  );
router
  .route("/business-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.updateBusinessInvestorDocuments),
    documentControllers.updateBusinessInvestorDocuments
  );
router
  .route("/business-investor")
  .get(auth(roleAccess.user), documentControllers.getBusinessInvestorDocuments);
router
  .route("/business-investor-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.updateBusinessInvestorDocumentsByAdmin),
    documentControllers.updateBusinessInvestorDocumentsByAdmin
  );

// Sophisticated Investor
router
  .route("/sophisticated-investor")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.addSophisticatedInvestorDocuments),
    documentControllers.addSophisticatedInvestorDocuments
  );
router
  .route("/sophisticated-investor")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.updateSophisticatedInvestorDocuments),
    documentControllers.updateSophisticatedInvestorDocuments
  );
router
  .route("/sophisticated-investor")
  .get(
    auth(roleAccess.user),
    documentControllers.getSophisticatedInvestorDocuments
  );
router
  .route("/sophisticated-investor-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.updateSophisticatedInvestorDocumentByAdmin),
    documentControllers.updateSophisticatedInvestorDocumentByAdmin
  );

// Fundraiser
router
  .route("/fundraiser")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.addFundraiserDocuments),
    documentControllers.addFundraiserDocuments
  );

router
  .route("/fundraiser")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.updateFundraiserDocuments),
    documentControllers.updateFundraiserDocuments
  );

router
  .route("/fundraiser")
  .get(auth(roleAccess.user), documentControllers.getFundraiserDocuments);

//admin update
router
  .route("/fundraiser-admin/:userId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.updateFundraiserDocumentByAdmin),
    documentControllers.updateFundraiserDocumentByAdmin
  );
router
  .route("/fundraiser-admin/:userId")
  .post(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(documentValidation.updateFundraiserDocumentByAdmin),
    documentControllers.updateFundraiserDocumentByAdmin
  );
router
  .route("/find-hash-urls")
  .get(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    //validate(documentValidation.updateFundraiserDocumentByAdmin),
    documentControllers.findHashUrls
  );

module.exports = router;
