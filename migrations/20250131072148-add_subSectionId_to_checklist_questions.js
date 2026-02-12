'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('checklist_questions', 'subSectionId', {
      type: Sequelize.UUID,
      allowNull: false, 
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('checklist_questions', 'subSectionId');
  }
};


