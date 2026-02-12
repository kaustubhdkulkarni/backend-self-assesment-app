'use strict';

const { otpType } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('otps', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('otps', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('otps', 'otpFor', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            otpType.phoneVerify,
            otpType.forgotPassword,
            otpType.transactionVerification,
          ],
        ],
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('otps', 'email');

    await queryInterface.changeColumn('otps', 'phoneNumber', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('otps', 'otpFor', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            otpType.phoneVerify,
            otpType.forgotPassword,
          ],
        ],
      },
    });
  },
};
