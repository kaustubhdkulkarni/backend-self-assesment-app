'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('kyc_details', {
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
			isKYCVerified: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},			
			isPhysicalKYCComplete: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false
			},
			civilNumber: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			expiryDateOfCivil: {
				type: Sequelize.DATE,
				allowNull: false,
				validate: {
					isDate: true,
				}
			},
			dateOfBirth: {
				type: Sequelize.DATE,
				allowNull: false,
				validate: {
					isDate: true,
				}
			},
			remarks: {
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
		await queryInterface.dropTable('kyc_details');
	}
};
