'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('documents', 'bankStatement', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('documents', 'companyProfile', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('documents', 'bankStatement');
    await queryInterface.removeColumn('documents', 'companyProfile');
  }
};
