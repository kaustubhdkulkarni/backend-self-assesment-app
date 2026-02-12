'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('transactions', 'bankDetails', {
      type: Sequelize.JSON,
      allowNull: true, // Set to true based on your model definition
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('transactions', 'bankDetails');
  }
};
