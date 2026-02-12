'use strict';

const { typeOfInterestRate } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new "manual" enum value to typeOfInterestRate
    await queryInterface.changeColumn('fundraiser_repayments', 'typeOfInterestRate', {
      type: Sequelize.ENUM(
        typeOfInterestRate.flat,
        typeOfInterestRate.manual  // ← new value
      ),
      allowNull: false,
      defaultValue: typeOfInterestRate.flat,
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: remove "manual" value
    await queryInterface.changeColumn('fundraiser_repayments', 'typeOfInterestRate', {
      type: Sequelize.ENUM(
        typeOfInterestRate.flat // ← revert to original
      ),
      allowNull: false,
      defaultValue: typeOfInterestRate.flat,
    });
  },
};
