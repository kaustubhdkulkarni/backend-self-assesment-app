'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('transactions', 'ratePerUSD', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: false,
    });
    await queryInterface.addColumn('transactions', 'amountToPayInUSD', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('transactions', 'ratePerUSD');
    await queryInterface.removeColumn('transactions', 'amountToPayInUSD');
  }
};
