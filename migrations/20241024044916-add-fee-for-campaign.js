'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('campaigns', 'minimumInvestmentRequired', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: true,
    });
    await queryInterface.addColumn('campaigns', 'campaignRegistrationFee', {
      type: Sequelize.DECIMAL(11, 4),
      allowNull: true,
    });
    await queryInterface.addColumn('campaigns', 'isCampaignRegistrationFeePaid', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
    await queryInterface.addColumn('campaigns', 'offeringType', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('campaigns', 'minimumInvestmentRequired');
    await queryInterface.removeColumn('campaigns', 'campaignRegistrationFee');
    await queryInterface.removeColumn('campaigns', 'isCampaignRegistrationFeePaid');
    await queryInterface.removeColumn('campaigns', 'offeringType');
  }
};
