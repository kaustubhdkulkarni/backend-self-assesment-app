'use strict';

const { otpType } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("otps", "otpFor", {
      type: Sequelize.ENUM(
          otpType.phoneVerify,
          otpType.forgotPassword,
          otpType.transactionVerification,
          otpType.investmentVerification,
          otpType.signInvestmentContract,
          otpType.investmentContactVerify
      ),
      allowNull: false,
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("otps", "otpFor", {
      type: Sequelize.ENUM(
          otpType.phoneVerify,
          otpType.forgotPassword,
          otpType.transactionVerification,
          otpType.investmentVerification,
          otpType.investmentEmailVerify,
          otpType.investmentPhoneVerify,
          otpType.signInvestmentContract
      ),
      allowNull: false,
  });
  }
};
