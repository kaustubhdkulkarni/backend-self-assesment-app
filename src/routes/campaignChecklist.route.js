const express = require('express');
const campaignChecklistController = require('../modules/campaignChecklist/controller');
const validate = require("../middlewares/validate");
const campaignChecklistValidation = require("../modules/campaignChecklist/campaignChecklist.validation");
const auth = require('../middlewares/auth');
const router = express.Router();
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');

router.route('/').post(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(campaignChecklistValidation.createCampaignChecklist),
    campaignChecklistController?.createCampaignChecklist
);
router.route('/:campaignChecklistId').put(
    auth(roleAccess.superAdmin),
    checkContentType(contentType.applicationJSON),
    validate(campaignChecklistValidation.updateCampaignChecklistById),
    campaignChecklistController?.updateCampaignChecklistById
);
module.exports = router;
