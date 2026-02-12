'use strict';

const { bankType } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('bank_details', 'bankType', {
      type: Sequelize.ENUM(...Object.values(bankType)),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('bank_details', 'bankType');
  }
};
