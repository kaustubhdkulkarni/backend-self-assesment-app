"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column already exists
    const tableInfo = await queryInterface.describeTable("request_to_repayment");

    if (!tableInfo.actionBy) {
      await queryInterface.addColumn("request_to_repayment", "actionBy", {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("request_to_repayment");

    if (tableInfo.actionBy) {
      await queryInterface.removeColumn("request_to_repayment", "actionBy");
    }
  },
};
