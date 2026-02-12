'use strict';

const { object } = require('joi');
const { bankType } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('contact_details', 'bankType', {
      type: Sequelize.ENUM(...Object.values(bankType)),
      allowNull: true,
    });
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('contact_details', 'bankType');
  }
};
