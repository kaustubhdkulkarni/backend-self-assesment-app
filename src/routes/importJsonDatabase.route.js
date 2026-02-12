const express = require('express');
const importJsonDatabaseControllers = require('../modules/importJsonDatabase/controllers');
const auth = require('../middlewares/auth');
const { roleAccess } = require('../config/enums');

const router = express.Router();

router.route('/import-users').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.importUsers
);

router.route('/import-system-user-roles').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.importSystemUserRoles
);

router.route('/import-system-users').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.importSystemUsers
);

router.route('/update-account-type-users').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.updateAccountTypeUsers
);

router.route('/import-user-contact-details').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.importContactDetails
);

router.route('/import-user-financial-details').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.importFinancialDetails
);

router.route('/import-user-commercial-details').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.importCommercialInformation
);

router.route('/import-user-company-management-details').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.importCompanyManagement
);

router.route('/import-user-fileUpload').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.importUserFileUpload
);

router.route('/import-campaigns').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.importCampaign
);

router.route('/import-general-info').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.importGeneralInfo
);

router.route('/import-malaas-names').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.importMalaasNames
);

router.route('/update-kyc-or-kyb').post(
    auth(roleAccess.superAdmin),
    importJsonDatabaseControllers.updateUserKycOrKyb
);

module.exports = router;
