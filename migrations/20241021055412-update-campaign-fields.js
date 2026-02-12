'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('campaigns', 'targetAmount', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: false
    });

    await queryInterface.addColumn('campaigns', 'campaignName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('campaigns', 'raisedAmount', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: true,
      defaultValue: 0
    });
    await queryInterface.addColumn('campaigns', 'noOfInvestments', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    });
    await queryInterface.addColumn('campaigns', 'campaignStartDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('campaigns', 'campaignEndDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('campaigns', 'targetAmount', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.removeColumn('campaigns', 'campaignName');
    await queryInterface.removeColumn('campaigns', 'raisedAmount');
    await queryInterface.removeColumn('campaigns', 'noOfInvestments');
    await queryInterface.removeColumn('campaigns', 'campaignStartDate');
    await queryInterface.removeColumn('campaigns', 'campaignEndDate');
  }
};
