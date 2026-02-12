"use strict";

const { investmentStatus } = require("../src/config/enums");



module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("investments", "investmentStatus", {
      type: Sequelize.ENUM(  investmentStatus.PENDING,
        investmentStatus.COMPLETED,
        investmentStatus.CANCELED,
        investmentStatus.SIGN_CONTRACT,
        investmentStatus.LOAN_DEPLOYED_DEBT,
        investmentStatus.PENDING_REPAYMENT,
        investmentStatus.REPAYMENT_COMPLETED,
      ),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("investments", "investmentStatus", {
      type: Sequelize.ENUM(
        investmentStatus.PENDING,
        investmentStatus.COMPLETED,
        investmentStatus.CANCELED,
        investmentStatus.SIGN_CONTRACT
      ),
      allowNull: false,
      defaultValue: investmentStatus.PENDING,
    });
  },
};
