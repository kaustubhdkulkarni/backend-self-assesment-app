'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove userId column
    await queryInterface.removeColumn("campaign_checklist", "userId");

    // Rename questionnaire column to checklist
    await queryInterface.renameColumn("campaign_checklist", "questionnaire", "checklist");

    // Add createdAt and updatedAt columns
    await queryInterface.addColumn("campaign_checklist", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });

    await queryInterface.addColumn("campaign_checklist", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Re-add userId column
    await queryInterface.addColumn("campaign_checklist", "userId", {
      type: Sequelize.UUID,
      allowNull: false,
    });

    // Rename checklist column back to questionnaire
    await queryInterface.renameColumn("campaign_checklist", "checklist", "questionnaire");

    // Remove createdAt and updatedAt columns
    await queryInterface.removeColumn("campaign_checklist", "createdAt");
    await queryInterface.removeColumn("campaign_checklist", "updatedAt");
  }
};
