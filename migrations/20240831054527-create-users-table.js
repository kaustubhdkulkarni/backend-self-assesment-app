'use strict';

const { accountType, roles } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			role: {
				type: Sequelize.ENUM(roles.admin, roles.user),
				allowNull: false,
				defaultValue: 'user',
			},
			active: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			isAccountLocked: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			accountLockingReason: {
				type: Sequelize.STRING,
				allowNull: true,
				defaultValue: "",
			},
			isMobileVerified: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			isEmailVerified: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
			accountType: {
				type: Sequelize.ENUM(accountType.investor, accountType.fundraiser),
				allowNull: false,
			},
			subRoleId: {
				type: Sequelize.UUID,
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
		await queryInterface.dropTable('users');
	}
};
