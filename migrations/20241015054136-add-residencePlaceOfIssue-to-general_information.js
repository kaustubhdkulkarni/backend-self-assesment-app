'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('general_informations', 'residencePlaceOfIssue', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('general_informations', 'investorType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('general_informations', 'residencePlaceOfIssue');
    await queryInterface.removeColumn('general_informations', 'investorType');
  }
};
