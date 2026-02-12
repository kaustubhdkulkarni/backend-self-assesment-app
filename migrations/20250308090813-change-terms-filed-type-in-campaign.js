'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("campaigns", "termsTitle", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("campaigns", "termsDoc", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("campaigns", "termsTitle", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("campaigns", "termsDoc", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  }
};
