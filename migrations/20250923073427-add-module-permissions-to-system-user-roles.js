"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, check if column exists
    const tableDefinition = await queryInterface.describeTable("system_user_roles");

    if (!tableDefinition["modulePermissions"]) {
      await queryInterface.addColumn("system_user_roles", "modulePermissions", {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}, // default empty object
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable("system_user_roles");

    if (tableDefinition["modulePermissions"]) {
      await queryInterface.removeColumn("system_user_roles", "modulePermissions");
    }
  },
};
