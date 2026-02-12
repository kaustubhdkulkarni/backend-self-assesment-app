'use strict';

const { transactionType, transactionStatus } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      transactionType: {
        type: Sequelize.ENUM(Object.values(transactionType)),
        allowNull: false,
      },
      transactionAmount: {
        type: Sequelize.DECIMAL(11, 4),
        allowNull: false,
        get() {
          const value = this.getDataValue('transactionAmount'); // Get the raw value
          return parseFloat(value); // Convert it to a number
        },
      },
      remainingAmount: {
        type: Sequelize.DECIMAL(11, 4),
        allowNull: true,
        defaultValue: 0,
        get() {
          const value = this.getDataValue('remainingAmount'); // Get the raw value
          return parseFloat(value); // Convert it to a number
        },
      },
      transactionStatus: {
        type: Sequelize.ENUM(Object.values(transactionStatus)),
        allowNull: false,
      },
      transactionSession:{
        type: Sequelize.STRING,
        allowNull:false
      },
      checkoutURL:{
        type: Sequelize.TEXT,
        allowNull:false
      },
      campaignId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      transactionResponse: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      expiryAt: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.dropTable('transactions');
  }
};
