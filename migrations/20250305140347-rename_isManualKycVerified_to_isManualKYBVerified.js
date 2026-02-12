'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('kyc_details', 'isManualKycVerified', 'isManualKYBVerified');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('kyc_details', 'isManualKYBVerified', 'isManualKycVerified');
  }
};
