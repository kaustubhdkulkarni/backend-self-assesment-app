'use strict';

const { kycDocStatus } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.renameColumn('kyc_details', 'frontOfId', 'crDoc');
		await queryInterface.renameColumn('kyc_details', 'frontOfIdStatus', 'crDocStatus');
		await queryInterface.renameColumn('kyc_details', 'frontOfIdRemark', 'crDocRemark');

		await queryInterface.renameColumn('kyc_details', 'photo', 'financialStatementDoc');
		await queryInterface.renameColumn('kyc_details', 'photoStatus', 'financialStatementStatus');
		await queryInterface.renameColumn('kyc_details', 'photoRemark', 'financialStatementRemark');

		await queryInterface.renameColumn('kyc_details', 'backOfId', 'companyProfileDoc');
		await queryInterface.renameColumn('kyc_details', 'backOfIdStatus', 'companyProfileStatus');
		await queryInterface.renameColumn('kyc_details', 'backOfIdRemark', 'companyProfileRemark');
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.renameColumn('kyc_details', 'crDoc', 'frontOfId');
		await queryInterface.renameColumn('kyc_details', 'crDocStatus', 'frontOfIdStatus');
		await queryInterface.renameColumn('kyc_details', 'crDocRemark', 'frontOfIdRemark');

		await queryInterface.renameColumn('kyc_details', 'financialStatementDoc', 'photo');
		await queryInterface.renameColumn('kyc_details', 'financialStatementStatus', 'photoStatus');
		await queryInterface.renameColumn('kyc_details', 'financialStatementRemark', 'photoRemark');

		await queryInterface.renameColumn('kyc_details', 'companyProfileDoc', 'backOfId');
		await queryInterface.renameColumn('kyc_details', 'companyProfileStatus', 'backOfIdStatus');
		await queryInterface.renameColumn('kyc_details', 'companyProfileRemark', 'backOfIdRemark');
	}
};
