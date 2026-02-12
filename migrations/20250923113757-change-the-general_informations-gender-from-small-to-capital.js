'use strict';

const { gender } = require("../src/config/enums");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Change gender column enum values
    await queryInterface.changeColumn('general_informations', 'gender', {
      type: Sequelize.ENUM(gender.male, gender.female, gender.other),
      allowNull: true, // keep nullable
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to old enum if needed
    await queryInterface.changeColumn('general_informations', 'gender', {
      type: Sequelize.ENUM(gender.male, gender.female, gender.other), // adjust if old enum differs
      allowNull: true,
    });
  },
};
