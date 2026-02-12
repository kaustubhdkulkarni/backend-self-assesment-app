'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.changeColumn("investments", "repaymentDate", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue:[]
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("investments", "repaymentDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

};
