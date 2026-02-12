'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('financial_details', 'currentValueOfCompany', {
      type: Sequelize.DECIMAL(16, 4),
      allowNull: true,
    });

    await queryInterface.changeColumn('financial_details', 'projectedValueOfCompany', {
      type: Sequelize.DECIMAL(16, 4),
      allowNull: true,
    });

    await queryInterface.changeColumn('financial_details', 'totalAssestValueOfCompany', {
      type: Sequelize.DECIMAL(16, 4),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('financial_details', 'currentValueOfCompany', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: true,
    });

    await queryInterface.changeColumn('financial_details', 'projectedValueOfCompany', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: true,
    });

    await queryInterface.changeColumn('financial_details', 'totalAssestValueOfCompany', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: true,
    });
  }
};
