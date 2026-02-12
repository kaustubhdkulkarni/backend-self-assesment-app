'use strict';
const { investmentStatus } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('investments', 'investmentStatus', {
      type: Sequelize.ENUM(
        investmentStatus.PENDING,
        investmentStatus.COMPLETED,
        investmentStatus.CANCELED,
      ), 
      allowNull: true,
      defaultValue: 'PENDING',
    });

    await queryInterface.addColumn('investments', 'contractUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('investments', 'investmentStatus');
    await queryInterface.removeColumn('investments', 'contractUrl');
  }
};
