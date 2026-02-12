'use strict';

const { tokenTypes } = require('../src/config/tokens');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('tokens', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			token: {
				type: Sequelize.STRING,
				allowNull: false,
				// unique: true, // Uncomment this line if you need a unique constraint
			},
			userId: {
				type: Sequelize.UUID,  // Assuming the User's ID is UUID
				allowNull: false,
			},
			type: {
				type: Sequelize.ENUM(
					tokenTypes.REFRESH,
					tokenTypes.RESET_PASSWORD,
					tokenTypes.VERIFY_EMAIL,
					tokenTypes.SETUP_PASSWORD,
					tokenTypes.SOCIAL_LOGIN
				),
				allowNull: false,
			},
			expires: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			blacklisted: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.NOW,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: true,
			}
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('tokens');
	}
};
