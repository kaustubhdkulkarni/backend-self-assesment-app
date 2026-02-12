'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('kyc_details', 'smileIdKYCReceipt', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('kyc_details', 'smileIdKYCReceipt', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  }
};
