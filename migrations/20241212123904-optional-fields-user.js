'use strict';

const { gender } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'gender', {
      type: Sequelize.ENUM(gender.male, gender.female, gender.other),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'gender', {
      type: Sequelize.ENUM(gender.male, gender.female, gender.other),
      allowNull: false
    });
  }
};
