'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ownership_informations', {
      id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      isOwnershipInformationCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      ownerFullName: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      ownerFullAddress: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      ownerCountryOfResidence: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      ownerIdOrPassportNumber: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      ownerDateOfBirth: {
          type: Sequelize.DATEONLY,
          allowNull: false,
      },
      ownerOwnershipPercentage: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
              min: 0,
              max: 100,
          },
      },
      directorFullName: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      directorFullAddress: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      directorCountryOfResidence: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      directorIdOrPassportNumber: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      directorDateOfBirth: {
          type: Sequelize.DATE,
          allowNull: true,
      },
      directorOwnershipPercentage: {
          type: Sequelize.INTEGER,
          allowNull: true,
          validate: {
              min: 0,
              max: 100,
          },
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ownership_informations');
  }
};
