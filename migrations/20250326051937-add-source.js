'use strict';

const { source } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "source", {
      type: Sequelize.ENUM(source.migrated, source.web, source.byAdmin),
      allowNull: true,
      defaultValue: source.web,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "source");
  }
};
