const express = require('express');
const subRoleControllers = require('../modules/subRoles/controllers');
const validate = require("../middlewares/validate");
const subRoleValidation = require("../modules/subRoles/subRole.validation");
const auth = require('../middlewares/auth');
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');
const router = express.Router();

router.route('/').post(
	auth(roleAccess.superAdmin),
	checkContentType(contentType.applicationJSON),
	validate(subRoleValidation.addSubRole),
	subRoleControllers.addSubRole
);

router.route('/').get(subRoleControllers.getAllSubRoles);

router.route("/update-subrole/:subRoleId").put(
	auth(roleAccess.superAdmin),
	checkContentType(contentType.applicationJSON),
	validate(subRoleValidation.updateSubrole),
	subRoleControllers.updteSubrole
);


module.exports = router;
