'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('company_managements', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			userId: {
				type: Sequelize.UUID,
				allowNull: false,
			},
			isCompanyManagementCompleted: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			authorizedOwners: {
				type: Sequelize.JSON,
				allowNull: true,
			},
			authorizedMembers: {
				type: Sequelize.JSON,
				allowNull: true,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: true,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('company_managements');
	}
};
