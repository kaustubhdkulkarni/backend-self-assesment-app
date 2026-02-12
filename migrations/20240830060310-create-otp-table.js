'use strict';

const { otpType } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('otps', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			phoneNumber: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			otpCode: {
				type: Sequelize.INTEGER,
				allowNull: false,
				validate: {
					len: [6, 6], // Ensure the OTP is exactly 6 digits long
				},
			},
			otpFor: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					isIn: [[otpType.phoneVerify, otpType.forgotPassword]], // Use enums for otpType
				},
			},
			expiresAt: {
				type: Sequelize.DATE,
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
		await queryInterface.dropTable('otps');
	}
};
