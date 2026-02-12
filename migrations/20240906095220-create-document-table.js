'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('documents', {
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
			isDocumentsUploadCompleted: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			residenceOrTaxIdDocURL: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			passportDocURL: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			crNumberDocURL: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			authorisedSignatureListDocURL: {
				type: Sequelize.STRING,
				allowNull: false,
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
		await queryInterface.dropTable('documents');
	}
};
