'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bank_details', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      isBankDetailCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isAccountStatusActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isMasterAccountDetails: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      isDividentAccountDetails: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      bankAccountNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      accountOpeningDate: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
          isDate: true,
        },
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bankAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bankRoutingCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bank_details');
  }
};
