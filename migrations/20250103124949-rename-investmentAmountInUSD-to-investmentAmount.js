'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'investments',
      'investmentAmountInUSD', 
      'investmentAmount' 
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'investments', 
      'investmentAmount', 
      'investmentAmountInUSD' 
    );
  }
};
