'use strict';

const { withdrawalStatus } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('withdrawals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      withdrawalAmount: {
        type: Sequelize.DECIMAL(11, 4),
        allowNull: false,
      },
      withdrawalStatus: {
        type: Sequelize.ENUM(Object.values(withdrawalStatus)), 
        allowNull: false,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bankAccountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bankRoutingCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      remark: {
        type: Sequelize.TEXT,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('withdrawals');
  }
};
