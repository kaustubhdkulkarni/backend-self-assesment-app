'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('questionnaires', 'checklist');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('checklist', 'questionnaires');
  }
};
