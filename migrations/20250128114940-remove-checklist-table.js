'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the checklist table
    await queryInterface.dropTable('checklist');
  },

  async down(queryInterface, Sequelize) {
    // Recreate the checklist table with only id and question columns
    await queryInterface.createTable('checklist', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  }
};
