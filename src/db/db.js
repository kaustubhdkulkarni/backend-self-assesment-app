const { Sequelize, Op } = require('sequelize');
const mysql = require('mysql2/promise');
const logger = require('../config/logger');
// const session = require('express-session');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Database configuration
const config = {
	username: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	host: process.env.MYSQL_HOST,
	dbPort: process.env.MYSQL_PORT,
	dialect: 'mysql',
};

// Create a connection to the MySQL server and ensure the database exists
const createDatabaseIfNotExists = async () => {
	const connection = await mysql.createConnection({
		host: config.host,
		user: config.username,
		password: config.password,
	});

	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
	await connection.end();
};

// Test connection and create database if it doesn't exist
const initializeDatabase = async () => {
	try {
		await createDatabaseIfNotExists();
		await sequelize.authenticate();
		logger.info('MySQL connection has been established successfully.');
	} catch (error) {
		logger.error('Unable to connect to the database:', error);
	}
};

// Initialize database connection
// initializeDatabase();

// Create Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: config.dialect,
	port: config.dbPort,
	logging: false, // Set to `console.log` to enable SQL query logging
	pool: {
		max: 50, // Increase max connections
		// max: 20,     // old before 14-11-2025
		min: 5,         // Keep some idle connections ready (optional)
	//	acquire: 30000, // 60s wait for connection — keep as is
		acquire: 60000, // Wait up to 60s for a connection before failing
		idle: 10000,    // close idle connections after 10s
	//	idle: 10000,    // old before 14-11-2025
	}
});
console.log("sequelize connection pool: ",sequelize?.connectionManager?.pool);

// // Initialize session store
// const sessionStore = new SequelizeStore({
// 	db: sequelize, // Use your existing Sequelize instance
//   });
// Import models
const db = {
	Tokens: require('../modules/tokens/token.model')(sequelize),
	Users: require('../modules/users/user.model')(sequelize),
	SubRoles: require('../modules/subRoles/subRole.model')(sequelize),
	Otps: require('../modules/otps/otp.model')(sequelize),
	GeneralInformations: require('../modules/generalInformation/generalInformation.model')(sequelize),
	ContactDetails: require('../modules/contactDetails/contactDetails.model')(sequelize),
	FinancialDetails: require('../modules/financialDetails/financialDetails.model')(sequelize),
	BankDetails: require('../modules/bankDetails/bankDetails.model')(sequelize),
	Documents: require('../modules/documents/document.model')(sequelize),
	CommercialInformation: require('../modules/commercialInformation/commercialInformation.model')(sequelize),
	CompanyManagement: require('../modules/companyManagement/companyManagement.model')(sequelize),
	OwnershipInformation: require('../modules/ownershipInformation/ownershipInformation.model')(sequelize),
	KYC: require('../modules/kyc/kyc.model')(sequelize),
	Campaign: require('../modules/campaigns/campaign.model')(sequelize),
	Wallet: require('../modules/wallet/wallet.model')(sequelize),
	Transaction: require('../modules/transactions/transaction.model')(sequelize),
	Currency: require('../modules/currencies/currency.model')(sequelize),
	Notification: require('../modules/notification/notification.model')(sequelize),
	Investment: require('../modules/investments/investment.model')(sequelize),
	Withdrawal: require('../modules/withdrawals/withdrawal.model')(sequelize),
	InvestmentLimits: require('../modules/investmentLimits/investmentLimits.model')(sequelize),
	Accreditations: require('../modules/Accreditations/accreditations.model')(sequelize),
	AccreditationRequests: require('../modules/AccreditationRequests/accreditationsRequests.model')(sequelize),
	AdminBankDetails: require('../modules/AdminBankDetails/adminBankDetails.model')(sequelize),
	FundraiserRepayment: require('../modules/fundraiserRepayments/fundraiserRepayments.model')(sequelize),
	ChecklistSection: require('../modules/checklist/checkListSections/checkListSections.model')(sequelize),
	ChecklistSubsection: require('../modules/checklist/checkListSubsections/checkListSubsections.model')(sequelize),
	ChecklistQuestion: require('../modules/checklist/checkListQuestions/checkListQuestions.model')(sequelize),
	CampaignChecklist: require('../modules/campaignChecklist/campaignChecklist.modal')(sequelize),
	ReturnOnInvestment: require('../modules/returnOnInvestment/returnOnInvestment.model')(sequelize),
	RequestToRepayment: require('../modules/requestToRepayment/requestToRepayment.model')(sequelize),
	SystemUserRoles: require('../modules/systemUserRoles/systemUserRoles.model')(sequelize),
	CampaignAnnouncement: require('../modules/campaignAnnouncement/campaignAnnouncement.model')(sequelize),
	WalletTopupRequests: require('../modules/walletTopupRequests/walletTopupRequests.model')(sequelize),

};

// Define associations
db.Tokens.belongsTo(db.Users, {
	foreignKey: 'userId',
});
db.Users.belongsTo(db.SubRoles, {
	foreignKey: 'subRoleId', as: 'subRoleObj'
});
db.GeneralInformations.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Users.hasOne(db.GeneralInformations, {
	foreignKey: 'userId', as: 'generalInfo'
});
db.ContactDetails.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Users.hasOne(db.ContactDetails, {
	foreignKey: 'userId', as: 'contactInfo'
});
db.BankDetails.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Users.hasOne(db.BankDetails, {
	foreignKey: 'userId', as: 'bankDetails'
});
db.FinancialDetails.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Users.hasOne(db.FinancialDetails, {
	foreignKey: 'userId', as: 'financialInfo'
});
db.Documents.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Users.hasOne(db.Documents, {
	foreignKey: 'userId', as: 'documentInfo'
});

db.CommercialInformation.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Users.hasOne(db.CommercialInformation, {
	foreignKey: 'userId', as: 'commercialInfo'
});

db.KYC.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});

db.Users.hasOne(db.KYC, {
    foreignKey: 'userId', 
    as: 'kycDetailObj'
});

db.CompanyManagement.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Users.hasOne(db.CompanyManagement, {
	foreignKey: 'userId', as: 'companyInfo'
});
db.OwnershipInformation.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Users.hasOne(db.OwnershipInformation, {
	foreignKey: 'userId', as: 'ownershipInfo'
});
db.Campaign.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Users.hasOne(db.Campaign, {
	foreignKey: 'userId', as: 'campaignInfo'
});
db.Wallet.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Transaction.belongsTo(db.Campaign, {
	foreignKey: 'campaignId', as: 'campaignObj'
});
db.Transaction.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Notification.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Investment.belongsTo(db.Users, {
	foreignKey: 'investorId', as: 'userObj'
});
db.Investment.belongsTo(db.Campaign, {
	foreignKey: 'campaignId', as: 'campaignObj'
});
db.Campaign.hasMany(db.Investment, {
	foreignKey: 'campaignId',
	as: 'investments'
});
db.Withdrawal.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.InvestmentLimits.belongsTo(db.SubRoles, {
	foreignKey: 'subRoleId', as: 'subRoleObj'
});
db.Accreditations.belongsTo(db.SubRoles, {
	foreignKey: 'subRoleId', as: 'subRoleObj'
});
db.AccreditationRequests.belongsTo(db.Users, {
	foreignKey: 'userId', as: 'userObj'
});
db.Users.belongsTo(db.AccreditationRequests, {
	foreignKey: 'accreditationRequestId', as: 'accreditationRequestObj'
});
db.AccreditationRequests.belongsTo(db.Accreditations, {
	foreignKey: 'accreditationId', as: 'accreditationObj'
});
db.SubRoles.hasOne(db.InvestmentLimits, {
	foreignKey: 'subRoleId', as: 'investmentLimitObj'
});
db.AdminBankDetails.belongsTo(db.Users, {
	foreignKey: 'adminId', as: 'userObj'
});
db.FundraiserRepayment.belongsTo(db.Users, {
	foreignKey: 'fundraiserId', as: 'userObj'
});
db.FundraiserRepayment.belongsTo(db.Campaign, {
	foreignKey: 'campaignId', as: 'campaignObj'
})

db.Campaign.hasOne(db.CampaignChecklist, {
	foreignKey: 'campaignId',
	as: 'campaignChecklist',
});

db.ReturnOnInvestment.belongsTo(db.Users, {
	foreignKey: 'investorId', as: 'userObj'
});

db.ReturnOnInvestment.belongsTo(db.Campaign, {
	foreignKey: 'campaignId', as: 'campaignObj'
});

db.RequestToRepayment.belongsTo(db.Users, {
	foreignKey: 'fundraiserId', as: 'userObj'
});

db.ChecklistSection.hasMany(db.ChecklistQuestion, {
	foreignKey: 'sectionId', as: 'checklistQuestions'
});

db.ChecklistSection.hasMany(db.ChecklistSubsection, {
	foreignKey: 'sectionId', as: 'checklistSubsections'
});

db.ChecklistSubsection.hasMany(db.ChecklistQuestion, {
	foreignKey: 'subSectionId', as: 'checklistQuestions'
});


db.RequestToRepayment.belongsTo(db.Campaign, {
	foreignKey: 'campaignId', as: 'campaignObj'
});

db.RequestToRepayment.belongsTo(db.FundraiserRepayment, {
	foreignKey: 'repaymentId', as: 'repaymentObj'
});

db.Users.belongsTo(db.SystemUserRoles,{
	foreignKey: "systemUserRoleId", as: "systemUserRoleObj"
})

db.CampaignAnnouncement.belongsTo(db.Campaign, {
	foreignKey: 'campaignId', as: 'campaignObj'
});

db.WalletTopupRequests.belongsTo(db.Users,{
	foreignKey: 'userId', as: 'userObj'
})


db.Sequelize = Sequelize;  // it gives access to sequelize utility functions like Sequelize.fn which  is use to execute functions like COUNT, SUM, DISTINCT...

module.exports = {
	sequelize,
	db,
	Op,
	// sessionStore,
	initializeDatabase
};