const express = require("express");
const kYCControllers = require("../modules/kyc/controllers");
const validate = require("../middlewares/validate");
const KYCValidation = require("../modules/kyc/kyc.validations");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");
const router = express.Router();

router.route("/validate-kyc").post(
    auth(roleAccess.user),
    // validate(KYCValidation.validateMalaaKYC),
    kYCControllers.verifyFullKYC
);

router
    .route("/validate-kyc-via-qr/:kyctoken")
    .post(
        validate(KYCValidation.validateKYCViaQR),
        kYCControllers.validateKYCViaQR
    );

router.route("/validate-smile-id-kyc").post(
    // auth(roleAccess.user),
    // validate(KYCValidation.validateMalaaKYC),
    kYCControllers.validateSmileIdKYC
);

router
    .route("/validate-manual-kyc")
    .post(
        auth(roleAccess.user),
        validate(KYCValidation.validateManualKyc),
        kYCControllers.validateManualKyc
    );

router
    .route("/manage/:id")
    .post(
        auth(roleAccess.superAdmin),
        validate(KYCValidation.manageKycDocuments),
        kYCControllers.manageKycDocuments
    );

router
    .route("/update-manual-kyb-doc/:kybId")
    .put(
        auth(roleAccess.user),
        validate(KYCValidation.updateManualKycDoc),
        kYCControllers.updateManualKybDoc
    );

router
    .route("/get-kyc-byid/:kycId")
    .get(
        auth(roleAccess.admin),
        validate(KYCValidation.getUserKycById),
        kYCControllers.getUserKycById
    );

    router
    .route("/user/:userId")
    .get(
        auth(roleAccess.admin),
        validate(KYCValidation.getUserKycByUserId),
        kYCControllers.getUserKycByUserId
    );

router
    .route("/reject-manual-kycdoc/:kycId")
    .post(
        auth(roleAccess.admin),
        validate(KYCValidation.rejectUserKycDoc),
        kYCControllers.rejectUserKycDoc
    );

router
    .route("/approve-manual-kycdoc/:kycId")
    .post(
        auth(roleAccess.admin),
        validate(KYCValidation.approveUserKycDoc),
        kYCControllers.approveUserKycDoc
    );

router
    .route("/reject-manual-user-kyc/:kycId")
    .post(
        auth(roleAccess.admin),
        validate(KYCValidation.rejectUserManualKyc),
        kYCControllers.rejectUserManualKyc
    );

router
    .route("/approve-manual-user-kyc/:kycId")
    .post(
        auth(roleAccess.admin),
        validate(KYCValidation.approveUserManualKyc),
        kYCControllers.approveUserManualKyc
    );

router
    .route("/get-kyc-doc")
    .get(auth(roleAccess.user), kYCControllers.getAndDownloadKYCdoc);

router
    .route("/get-is-kyc-check")
    .get(auth(roleAccess.user), kYCControllers.getIsKycCheck);

router
    .route("/get-all-kyc-docs")
    .get(auth(roleAccess.admin), kYCControllers.getKYCAllDocsByAdmin);

router
    .route("/get-user-kyc-status")
    .get(auth(roleAccess.user), kYCControllers.getUserKYCStatus);

router
    .route("/get-user-civil-details")
    .get(auth(roleAccess.user), kYCControllers.getCivilDetails);

router
    .route("/check-and-expire-kyc")
    .put(auth(roleAccess.admin), kYCControllers.kycExpiryCheck);

    router
    .route("/get-civil-details")
    .get(
        auth(roleAccess.admin),
        validate(KYCValidation.getAdminCivilDetails),
        kYCControllers.getCivilDetailsByAdmin
    );

router.route('/mobile-kyc').post(kYCControllers.mobileSmileIdKyc);

module.exports = router;
