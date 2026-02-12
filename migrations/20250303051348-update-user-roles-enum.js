'use strict';

const { roles } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.ENUM(
        roles.superAdmin,
        roles.admin,
        roles.backofficeUser,
        roles.systemUser,
        roles.user
      ),
      allowNull: false,
      defaultValue: roles.user, // Ensure default is still 'user'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "role", {
      type: Sequelize.ENUM(roles.admin, roles.systemUser, roles.user),
      allowNull: false,
      defaultValue: roles.user,
    });
  }
};
