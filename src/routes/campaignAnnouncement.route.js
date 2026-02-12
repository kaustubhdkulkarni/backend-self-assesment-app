const express = require('express');
const campaignAnnouncementControllers = require('../modules/campaignAnnouncement/controllers');
const validate = require("../middlewares/validate");
const campaignAnnouncementValidation = require('../modules/campaignAnnouncement/campaignAnnouncement.validation')
const auth = require('../middlewares/auth');
const router = express.Router();
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');


router.route('/').post(
	auth(roleAccess.user),
	checkContentType(contentType.applicationJSON),
	validate(campaignAnnouncementValidation.addCampaignAnnouncement),
	campaignAnnouncementControllers.addCampaignAnnouncement);

router.route('/for-fundraiser/:campaignId').get(
	auth(roleAccess.user),
	campaignAnnouncementControllers.getCampaignAnnouncementForFundraiser
);

router.route('/for-investor/:campaignId').get(
	auth(roleAccess.user),
	campaignAnnouncementControllers.getCampaignAnnouncementForInvestor
);

router.route('/:announcementId').put(
    auth(roleAccess.user),
	checkContentType(contentType.applicationJSON),
	validate(campaignAnnouncementValidation.updateCampaignAnnouncement),
    campaignAnnouncementControllers.updateCampaignAnnouncement
);

module.exports = router;