const express = require("express");
const campaignControllers = require("../modules/campaigns/controllers");
const validate = require("../middlewares/validate");
const campaignValidation = require("../modules/campaigns/campaign.validation");
const auth = require("../middlewares/auth");
const { roleAccess, contentType } = require("../config/enums");
const checkContentType = require("../middlewares/checkContentType");
const router = express.Router();

// Campaign
router
  .route("/")
  .post(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(campaignValidation.addCampaignDetailTarget),
    campaignControllers.addCampaignDetailTarget
  );
router
  .route("/document/:campaignId")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(campaignValidation.addCampaignDetailDocuments),
    campaignControllers.updateCampaignByUser
  );
router
  .route("/pitch/:campaignId")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(campaignValidation.addCampaignDetailPitch),
    campaignControllers.updateCampaignByUser
  );
router
  .route("/")
  .put(
    auth(roleAccess.user),
    checkContentType(contentType.applicationJSON),
    validate(campaignValidation.updateCampaignByUser),
    campaignControllers.updateCampaignByUser
  );
router
  .route("/user-campaign/:campaignId")
  .get(
    auth(roleAccess.user),
    validate(campaignValidation.getFundraiserCampaignById),
    campaignControllers.getCampaignByUser
  );
router.route("/live").get(campaignControllers.getLiveCampaign);
router
  .route("/campaignById/:campaignId")
  .get(auth(roleAccess.user), campaignControllers.getCampaignById);
router
  .route("/get-campaignStatus/:campaignId")
  .get(
    auth(roleAccess.user),
    validate(campaignValidation.getFundraiserCampaignById),
    campaignControllers.getCampaignStatus
  );
router
  .route("/get-campaign-list")
  .get(
    auth([roleAccess.user], "Campaigns", "main"),
    campaignControllers.getCampaignList
  );

// Admin API's
router
  .route("/update/:campaignId")
  .put(
    auth([roleAccess.user], "Campaigns", "main"),
    checkContentType(contentType.applicationJSON),
    validate(campaignValidation.updateCampaignByAdmin),
    campaignControllers.updateCampaignByAdmin
  );

router
  .route("/campaign-reg-fee/:campaignId")
  .put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(campaignValidation.requestCampaignFeeByAdmin),
    campaignControllers.requestCampaignRegFee
  );

router
  .route("/check-campaign-target-raised")
  .get(
    auth([roleAccess.user], "Campaigns", "main"),
    campaignControllers.checkCampaignTargetRaised
  );

router
  .route("/get-all-campaigns-by-admin")
  .get(auth(roleAccess.admin), campaignControllers.getAllCampaignsByAdmin);

router
  .route("/get-all-campaigns-count-by-admin")
  .get(
    auth(roleAccess?.systemUser),
    campaignControllers.getAllCampaignsCountByAdmin
  );

router
  .route("/get-campaign-byid/:campaignId")
  .get(
    auth([roleAccess.user], "Campaigns", "main"),
    validate(campaignValidation.getCampaignForAdmin),
    campaignControllers.getCampaignForAdmin
  );

// add campaign by admin
router
  .route("/add-campaign-by-admin/:userId")
  .post(
    auth([roleAccess.user], "Campaigns", "main"),
    checkContentType(contentType.applicationJSON),
    validate(campaignValidation.addCampaignByAdmin),
    campaignControllers.addCampaignByAdmin
  );

// get prime campaign
router
  .route("/get-prime-campaign")
  .get(auth(roleAccess.user), campaignControllers.getPrimeCampaign);

router
  .route("/get-fundraiser-campaigns")
  .get(auth(roleAccess.user), campaignControllers.getFundraiserCampaigns);

router
  .route("/suspend-campaign/:campaignId")
  .post(
    auth(roleAccess.admin),
    validate(campaignValidation.suspendCampaign),
    campaignControllers.suspendCampaign
  );
router
  .route("/update-repay-dates")
  .get(
    auth([roleAccess.user], "Campaigns", "main"),
    campaignControllers.updateRepaymentDueDate
  );

router
  .route("/resume-campaign/:campaignId")
  .post(
    auth(roleAccess.admin),
    validate(campaignValidation.suspendCampaign),
    campaignControllers.unSuspendCampaign
  );

module.exports = router;
