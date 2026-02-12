'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('contact_details', {
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
			isContactDetailsCompleted: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			officeNumber: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			buildingName: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			streetName: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			poBox: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			postalCode: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			city: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			state: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			country: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			permanentAddress: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			permanentPostalCode: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			permanentRegisteredCountry: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('contact_details');
	}
};
