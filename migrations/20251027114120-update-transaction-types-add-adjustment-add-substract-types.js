'use strict';

const { transactionType } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Adding ADJUSTMENT ADD and ADJUSTMENT SUBTRACT to transactionType enum...');
    
    // Add new adjustment types to the ENUM
    await queryInterface.changeColumn('transactions', 'transactionType', {
      type: Sequelize.ENUM(
        transactionType.ADD_FUNDS,
        transactionType.INVEST_FUNDS,
        transactionType.WITHDRAW_FUNDS,
        transactionType.DISBURSE,
        transactionType.REFUND,
        transactionType.CAMPAIGN_REGISTRATION_FEE,
        transactionType.REPAYMENT,
        transactionType.ADJUSTMENT_ADD,        // ← NEW
        transactionType.ADJUSTMENT_SUBTRACT    // ← NEW
      ),
      allowNull: false,
    });
    
    console.log('✅ Successfully added ADJUSTMENT ADD and ADJUSTMENT SUBTRACT types');
  },

  async down(queryInterface, Sequelize) {
    console.log('Removing ADJUSTMENT ADD and ADJUSTMENT SUBTRACT from transactionType enum...');
    
    // Remove the adjustment types
    await queryInterface.changeColumn('transactions', 'transactionType', {
      type: Sequelize.ENUM(
        transactionType.ADD_FUNDS,
        transactionType.INVEST_FUNDS,
        transactionType.WITHDRAW_FUNDS,
        transactionType.DISBURSE,
        transactionType.REFUND,
        transactionType.CAMPAIGN_REGISTRATION_FEE,
        transactionType.REPAYMENT
      ),
      allowNull: false,
    });
    
    console.log('❌ Removed ADJUSTMENT types');
  },
};
