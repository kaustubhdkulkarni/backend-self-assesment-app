const express = require('express');
const accreditationControllers = require('../modules/Accreditations/controllers');
const validate = require("../middlewares/validate");
const accreditationValidation = require("../modules/Accreditations/accreditations.validation");
const auth = require('../middlewares/auth');
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');
const router = express.Router();

router.route('/').post(
	auth(roleAccess.superAdmin),
	checkContentType(contentType.applicationJSON),
	validate(accreditationValidation.addAccreditations),
	accreditationControllers.addAccreditations
);
router.route('/:accreditationId').put(
	auth(roleAccess.superAdmin),
	checkContentType(contentType.applicationJSON),
	validate(accreditationValidation.updateAccreditation),
	accreditationControllers.updateAccreditation
);
router.route('/').get(
	auth(roleAccess.superAdmin),
	accreditationControllers.getAccreditations
);
router.route('/get-accreditation/:id').get(
	auth(roleAccess.superAdmin),
	validate(accreditationValidation.getAccreditationById),
	accreditationControllers.getAccreditationById
);
router.route('/:id').delete(
	auth(roleAccess.superAdmin),
	validate(accreditationValidation.deleteAccreditation),
	accreditationControllers.deleteAccreditation
);
router.route('/get-user-accreditation').get(
	auth(roleAccess.user),
	accreditationControllers.getUserAccreditation
);

module.exports = router;
