'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'systemUserRole', 'systemUserRoleId');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'systemUserRoleId', 'systemUserRole');
  }
};
