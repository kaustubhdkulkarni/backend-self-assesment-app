'use strict';

const { campaignStatus } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('campaigns', 'campaignStatus', {
      type: Sequelize.ENUM(
        campaignStatus.DRAFT,
        campaignStatus.WAITING_FOR_REGISTRATION_FEE,
        campaignStatus.FUNDRAISING_LIVE,
        campaignStatus.UNSUCCESSFUL,
        campaignStatus.SUCCESSFUL,
        campaignStatus.TEMPORARILY_SUSPENDED 
      ),
      allowNull: true,
      defaultValue: campaignStatus.DRAFT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('campaigns', 'campaignStatus', {
      type: Sequelize.ENUM(
        campaignStatus.DRAFT,
        campaignStatus.WAITING_FOR_REGISTRATION_FEE,
        campaignStatus.FUNDRAISING_LIVE,
        campaignStatus.UNSUCCESSFUL,
        campaignStatus.SUCCESSFUL
      ),
      allowNull: true,
      defaultValue: campaignStatus.DRAFT,
    });
  },
};
