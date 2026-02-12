const express = require('express');
const userRoutes = require("./user.route")
const authRoutes = require("./auth.route")
const subRoleRoutes = require("./subRole.route")
const otpRoutes = require("./otp.route")
const generalInformationRoutes = require("./generalInformation.route")
const contactDetailRoutes = require("./contactDetail.route")
const financialDetailRoutes = require("./financialDetail.route")
const bankDetailRoutes = require("./bankDetail.route")
const companyManagementRoutes = require("./companyManagement.route")
const documentRoutes = require("./documents.route")
const commercialInfoRoutes = require("./commercialInformation.route")
const ownershipInfoRoutes = require("./ownershipInformation.route")
const kycRoutes = require("./kyc.route")
const campaignRoutes = require("./campaign.route");
const multer = require('multer');
const path = require('path');
const walletRoutes = require("./wallet.route")
const transactionRoutes = require("./transaction.route")
const currencyRoutes = require("./currency.route")
const investmentRoutes = require("./investment.route")
const investmentLimitRoutes = require("./investmentLimits.route")
const notificationRoutes = require("./notification.route");
const withdrawalRoutes = require("./withdrawal.route");
const accreditationRoutes = require("./accreditation.route");
const accreditationRequestsRoutes = require("./accreditationRequests.route");
const adminBankDetailsRoutes = require("./adminBankDetails.route");
const fundraiserRepaymentsRoutes = require("./fundraiserRepayment.route")
const checklistSectionsRoute = require("./checklistSections.route")
const checklistSubsectionRoute = require("./checklistSubsection.route")
const checklistQuestionsRoute = require("./checklistQuestions.route")
const campaignChecklistRoutes = require("./campaignChecklist.route")
const returnOnInvestmentsRoutes = require("./returnOnInvestmentsRoutes.routes");
const requestToRepaymentRoutes = require("./requestToRepaymentRoutes.routes");
const campaignAnnouncementRoutes = require("./campaignAnnouncement.route");
const systemUserRolesRoutes = require("./systemUserRoles.route");
const importJsonDatabase = require("./importJsonDatabase.route");
const walletTopupRequestsRoutes = require("./walletTopupRequests.route");
const sendgridRoutes = require("./sendgrid.route");
const { uploadFile } = require('../modules/documents/controllers');
const auth = require('../middlewares/auth');
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');
const router = express.Router();
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = path.resolve(__dirname, '../../uploads/');
		cb(null, uploadPath)
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, uniqueSuffix + "-" + file.originalname)
	}
})
const upload = multer({
	storage: storage,
	limits: {
		fileSize: MAX_FILE_SIZE
	}
})

const defaultRoutes = [
	{
		path: '/auth',
		route: authRoutes,
	},
	{
		path: '/users',
		route: userRoutes,
	},
	{
		path: '/sub-roles',
		route: subRoleRoutes,
	},
	{
		path: '/otp',
		route: otpRoutes,
	},
	{
		path: '/general-info',
		route: generalInformationRoutes,
	},
	{
		path: '/contact-details',
		route: contactDetailRoutes,
	},
	{
		path: '/financial-details',
		route: financialDetailRoutes
	},
	{
		path: '/bank-details',
		route: bankDetailRoutes,
	},
	{
		path: '/company-management',
		route: companyManagementRoutes,
	},
	{
		path: '/documents',
		route: documentRoutes,
	},
	{
		path: '/commercial-information',
		route: commercialInfoRoutes,
	},
	{
		path: '/ownership-information',
		route: ownershipInfoRoutes,
	},
	{
		path: '/kyc',
		route: kycRoutes,
	},
	{
		path: '/campaign',
		route: campaignRoutes,
	},
	{
		path: '/wallet',
		route: walletRoutes,
	},
	{
		path: '/transaction',
		route: transactionRoutes,
	},
	{
		path: '/currency',
		route: currencyRoutes,
	},
	{
		path: '/investment',
		route: investmentRoutes,
	},
	{
		path: '/investment-limits',
		route: investmentLimitRoutes,
	},
	{
		path: '/notification',
		route: notificationRoutes,
	},
	{
		path: '/withdrawal',
		route: withdrawalRoutes,
	},
	{
		path: '/accreditation',
		route: accreditationRoutes,
	},
	{
		path: '/accreditationRequests',
		route: accreditationRequestsRoutes,
	},
	{
		path: '/admin-bank-details',
		route: adminBankDetailsRoutes,
	},
	{
		path: '/fundraiser-repayments',
		route: fundraiserRepaymentsRoutes,
	},
	{
		path: '/checklist-sections',
		route: checklistSectionsRoute,
	},
	{
		path: '/checklist-subsections',
		route: checklistSubsectionRoute,
	},
	{
		path: '/checklist-questions',
		route: checklistQuestionsRoute,
	},
	{
		path: '/campaign-checklists',
		route: campaignChecklistRoutes,
	},
	{
		path: '/return-on-investments',
		route: returnOnInvestmentsRoutes,
	},
	{
		path: '/request-to-repayments',
		route: requestToRepaymentRoutes,
	},
	{
		path: '/system-user-roles',
		route: systemUserRolesRoutes,
	},
	{
		path: '/campaign-announcement',
		route: campaignAnnouncementRoutes,
	},
	{
		path: '/import-data',
		route: importJsonDatabase,
	},
	{
		path: '/wallet-topup-requests',
		route: walletTopupRequestsRoutes,
	},
	{
		path: '/sendgrid',
		route: sendgridRoutes,
	},
];

router.post('/upload-file',
	auth(roleAccess.user),
	checkContentType(contentType?.multipartForm),
	upload.single("documentUrl"),
	uploadFile
);

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;