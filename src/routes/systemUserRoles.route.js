const express = require('express');
const systemUserRolesControllers = require('../modules/systemUserRoles/controllers');
const validate = require("../middlewares/validate");
const systemUserRolesValidation = require("../modules/systemUserRoles/systemUserRoles.validations");
const auth = require('../middlewares/auth');
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');
const router = express.Router();


router.route('/').post(
	auth(roleAccess.superAdmin),
	checkContentType(contentType.applicationJSON),
	validate(systemUserRolesValidation.addSystemUserRole),
	systemUserRolesControllers.addSystemUserRole
);

router.route('/:roleId').put(
	auth(roleAccess.superAdmin),
	checkContentType(contentType.applicationJSON),
	validate(systemUserRolesValidation.updateSystemUserRole),
	systemUserRolesControllers.updateSystemUserRole
);

router.route('/').get(
	auth(roleAccess.superAdmin),
	systemUserRolesControllers.getSystemUserRole
);

// router.route('/:roleId').delete(
// 	auth(roleAccess.superAdmin),
// 	validate(systemUserRolesValidation.deleteSystemUserRole),
// 	systemUserRolesControllers.deleteSystemUserRole
// );

router.route('/get-all-roles').get(
	auth(roleAccess.superAdmin),
	systemUserRolesControllers.getAllSystemUserRoles
);


module.exports = router;
