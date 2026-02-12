'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameTable('campaign_questionary_status', 'campaign_checklist');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('campaign_checklist', 'campaign_questionary_status');
  }
};
