'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('general_informations', 'NoOfEmployeeInCompany', 'noOfEmployeeInCompany');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('general_informations', 'noOfEmployeeInCompany', 'NoOfEmployeeInCompany');
  }
};
