"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column already exists
    const tableInfo = await queryInterface.describeTable("kyc_details");

    if (!tableInfo.actionBy) {
      await queryInterface.addColumn("kyc_details", "actionBy", {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("kyc_details");

    if (tableInfo.actionBy) {
      await queryInterface.removeColumn("kyc_details", "actionBy");
    }
  },
};
