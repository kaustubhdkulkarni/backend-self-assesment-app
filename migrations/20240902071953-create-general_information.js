'use strict';

const { gender } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('general_informations', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			userId: {
				type: Sequelize.UUID,
				allowNull: false
			},
			isGeneralInformationCompleted: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: true,
				validate: {
					isEmail: true,
				},
			},
			contactNumber: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			residenceCountry: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			birthDate: {
				type: Sequelize.DATE,
				allowNull: true,
				validate: {
					isDate: true,
				},
			},
			birthPlace: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			residenceIDType: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			residenceIDNumber: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			residenceIDCountry: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			expiryDateOfID: {
				type: Sequelize.DATE,
				allowNull: true,
				validate: {
					isDate: true,
				}
			},
			taxIDNumber: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			gender: {
				type: Sequelize.ENUM(gender.male, gender.female, gender.other),
				allowNull: true,
			},
			nationality: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			education: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			occupationPersonName: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			occupationPersonAddress: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			occupationContactNumber: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			occupationEmploymentType: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			occupation: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			alternateContactName: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			alternateContactEmail: {
				type: Sequelize.STRING,
				allowNull: true,
				validate: {
					isEmail: true,
				},
			},
			alternateContactNumber: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			designationAlternatePerson: {
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
		await queryInterface.dropTable('general_informations');
	}
};
