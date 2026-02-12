'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('kyc_details', 'frontOfId', {
			type: Sequelize.JSON,
			allowNull: true,
			defaultValue: []
		});
		await queryInterface.changeColumn('kyc_details', 'photo', {
			type: Sequelize.JSON,
			allowNull: true,
			defaultValue: []
		});
		await queryInterface.changeColumn('kyc_details', 'backOfId', {
			type: Sequelize.JSON,
			allowNull: true,
			defaultValue: []
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn('kyc_details', 'frontOfId', {
			type: Sequelize.STRING,
			allowNull: true,
		});
		await queryInterface.changeColumn('kyc_details', 'photo', {
			type: Sequelize.STRING,
			allowNull: true,
		});
		await queryInterface.changeColumn('kyc_details', 'backOfId', {
			type: Sequelize.STRING,
			allowNull: true,
		});
	}
};
