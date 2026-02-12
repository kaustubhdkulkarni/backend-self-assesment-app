'use strict';

const { tokenTypes } = require('../src/config/tokens');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('tokens', 'type', {
      type: Sequelize.ENUM(
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
        tokenTypes.SETUP_PASSWORD,
        tokenTypes.SOCIAL_LOGIN,
        tokenTypes.INVESTMENT_VERIFICATION 
      ),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('tokens', 'type', {
      type: Sequelize.ENUM(
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
        tokenTypes.SETUP_PASSWORD,
        tokenTypes.SOCIAL_LOGIN 
      ),
      allowNull: false,
    });
  }
};
