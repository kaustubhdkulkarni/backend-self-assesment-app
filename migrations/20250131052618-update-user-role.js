'use strict';

const { roles } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.ENUM(roles.admin, roles.systemUser, roles.user),
      allowNull: false,
      defaultValue: roles.user, // Ensure default is still 'user'
    });

    await queryInterface.addColumn("users", "systemUserRole", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "systemUserRole");

    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.ENUM(roles.admin, roles.user), // Removing systemUser in rollback
      allowNull: false,
      defaultValue: roles.user,
    });
  }
};
