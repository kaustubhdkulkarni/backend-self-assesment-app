'use strict';

const { accountType } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'accountType', {
      type: Sequelize.ENUM(
        accountType.investor,
        accountType.fundraiser,
        '' // Include the new value here
      ),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'accountType', {
      type: Sequelize.ENUM(
        accountType.investor,
        accountType.fundraiser // Revert to the previous values
      ),
      allowNull: false,
    });
  }
};
