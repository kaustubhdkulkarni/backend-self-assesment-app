'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'financial_details', 
      'companyValuation',  
      {
        type: Sequelize.DECIMAL(16, 4),
        allowNull: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'financial_details',  
      'companyValuation'    
    );
  }
};
