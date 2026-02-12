'use strict';

const { otpType } = require('../src/config/enums');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update the enum for 'otpFor' field to replace 'transaction_verification' with 'investment_verification'
    await queryInterface.changeColumn('otps', 'otpFor', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            otpType.phoneVerify, // Existing values
            otpType.forgotPassword, 
            otpType.investmentVerification, // Corrected value from enum
          ],
        ],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the enum for 'otpFor' field back to 'transaction_verification'
    await queryInterface.changeColumn('otps', 'otpFor', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            otpType.phoneVerify, 
            otpType.forgotPassword, 
            otpType.transactionVerification, // Revert back to the original value
          ],
        ],
      },
    });
  },
};
