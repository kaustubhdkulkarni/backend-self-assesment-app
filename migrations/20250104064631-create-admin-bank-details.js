'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('admin_bank_details', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      adminId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      isBankDetailCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      isAccountStatusActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      isPrimaryBank: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      bankAccountNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankAccountHolderName: { 
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankRoutingCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('admin_bank_details');
  }
};
