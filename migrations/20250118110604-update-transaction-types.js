'use strict';

const { transactionType } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('transactions', 'transactionType', {
      type: Sequelize.ENUM(
        transactionType.ADD_FUNDS,
        transactionType.INVEST_FUNDS,
        transactionType.WITHDRAW_FUNDS,
        transactionType.DISBURSE,
        transactionType.REFUND,
        transactionType.CAMPAIGN_REGISTRATION_FEE 
      ),
      allowNull: true,
    });
  },
};
