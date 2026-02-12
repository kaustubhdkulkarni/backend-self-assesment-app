'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('kyc_details', 'dateOfBirth');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('kyc_details', 'dateOfBirth', {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      }
    });
  }
};
