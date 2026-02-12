"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if column already exists
    const tableInfo = await queryInterface.describeTable("accreditation_requests");

    if (!tableInfo.actionBy) {
      await queryInterface.addColumn("accreditation_requests", "actionBy", {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Optional: only remove if exists
    const tableInfo = await queryInterface.describeTable("accreditation_requests");

    if (tableInfo.actionBy) {
      await queryInterface.removeColumn("accreditation_requests", "actionBy");
    }
  },
};
