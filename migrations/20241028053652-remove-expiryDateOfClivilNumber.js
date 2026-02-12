'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.removeColumn('users', 'expiryDateOfCivilNumber');
    const tableDescription = await queryInterface.describeTable('users');

    // Check if the column 'expiryDateOfCivilNumber' exists
    if (tableDescription.expiryDateOfCivilNumber) {
      await queryInterface.removeColumn('users', 'expiryDateOfCivilNumber');
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'expiryDateOfCivilNumber', {
      type: Sequelize.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
    });
  }
};
