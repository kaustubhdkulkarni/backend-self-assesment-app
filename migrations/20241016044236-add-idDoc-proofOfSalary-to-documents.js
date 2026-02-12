'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('documents', 'idDoc', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('documents', 'proofOfSalary', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('documents', 'idDoc');
    await queryInterface.removeColumn('documents', 'proofOfSalary');
  }
};
