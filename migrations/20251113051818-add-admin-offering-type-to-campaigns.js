'use strict';

const { adminOfferingTypes } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('campaigns', 'adminOfferingType', {
      type: Sequelize.ENUM(...Object.values(adminOfferingTypes)),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('campaigns', 'adminOfferingType');
  }
};
