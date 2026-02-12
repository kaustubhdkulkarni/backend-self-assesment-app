'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('campaigns', 'targetAmount', {
      type: Sequelize.DECIMAL(16, 4),
      allowNull: false,
    });

    await queryInterface.changeColumn('campaigns', 'minimumInvestmentRequired', {
      type: Sequelize.DECIMAL(16, 4),
      allowNull: false,
    });

    await queryInterface.changeColumn('campaigns', 'raisedAmount', {
      type: Sequelize.DECIMAL(16, 4),
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.changeColumn('campaigns', 'campaignRegistrationFee', {
      type: Sequelize.DECIMAL(16, 4),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('campaigns', 'targetAmount', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: false,
    });

    await queryInterface.changeColumn('campaigns', 'minimumInvestmentRequired', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: false,
    });

    await queryInterface.changeColumn('campaigns', 'raisedAmount', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.changeColumn('campaigns', 'campaignRegistrationFee', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: true,
    });
  }
};
