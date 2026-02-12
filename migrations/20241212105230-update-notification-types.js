'use strict';

const { notificationTypes } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('notifications', 'notificationType', {
      type: Sequelize.ENUM(
        notificationTypes.CAMPAIGN_REGISTRATION_FEE,
        notificationTypes.CAMPAIGN_STATUS_UPDATE,
        notificationTypes.INVESTMENT_RECEIVED,
        notificationTypes.WITHDRAWAL_REQUEST_APPROVED,
        notificationTypes.WITHDRAWAL_REQUEST_REJECTED,
        notificationTypes.FROM_ADMIN
      ),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('notifications', 'notificationType', {
      type: Sequelize.ENUM(
        notificationTypes.CAMPAIGN_REGISTRATION_FEE,
        notificationTypes.CAMPAIGN_STATUS_UPDATE,
        notificationTypes.INVESTMENT_RECEIVED,
        notificationTypes.KYB_PENDING,
        notificationTypes.KYC_PENDING,
        notificationTypes.SUB_ROLE
      ),
      allowNull: true,
    });
  }
};
