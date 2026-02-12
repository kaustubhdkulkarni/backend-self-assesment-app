'use strict';

const { transactionType } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Get current enum values
    const tableDescription = await queryInterface.describeTable('transactions');
    
    // Step 2: Add new ADJUSTMENT value to ENUM
    await queryInterface.changeColumn('transactions', 'transactionType', {
      type: Sequelize.ENUM(
        transactionType.ADD_FUNDS,
        transactionType.INVEST_FUNDS,
        transactionType.WITHDRAW_FUNDS,
        transactionType.DISBURSE,
        transactionType.REFUND,
        transactionType.CAMPAIGN_REGISTRATION_FEE,
        transactionType.REPAYMENT,
        transactionType.ADJUSTMENT  // ← ADD THIS
      ),
      allowNull: false,
    });
    
    console.log('✅ Added ADJUSTMENT to transactionType enum');
  },

  async down(queryInterface, Sequelize) {
    // Remove ADJUSTMENT from enum
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
    
    console.log('❌ Removed ADJUSTMENT from transactionType enum');
  },
};
