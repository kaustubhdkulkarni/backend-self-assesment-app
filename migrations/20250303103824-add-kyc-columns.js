'use strict';

const { kycType, kycDocStatus } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('kyc_details', 'frontOfId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('kyc_details', 'frontOfIdStatus', {
      type: Sequelize.ENUM(...Object.values(kycDocStatus)),
      allowNull: true,
    });
    await queryInterface.addColumn('kyc_details', 'photo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('kyc_details', 'photoStatus', {
      type: Sequelize.ENUM(...Object.values(kycDocStatus)),
      allowNull: true,
    });
    await queryInterface.addColumn('kyc_details', 'backOfId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('kyc_details', 'backOfIdStatus', {
      type: Sequelize.ENUM(...Object.values(kycDocStatus)),
      allowNull: true,
    });
    await queryInterface.addColumn('kyc_details', 'kycType', {
      type: Sequelize.ENUM(...Object.values(kycType)),
      allowNull: true,
    });
    await queryInterface.addColumn('kyc_details', 'isManualKycVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('kyc_details', 'frontOfId');
    await queryInterface.removeColumn('kyc_details', 'frontOfIdStatus');
    await queryInterface.removeColumn('kyc_details', 'photo');
    await queryInterface.removeColumn('kyc_details', 'photoStatus');
    await queryInterface.removeColumn('kyc_details', 'backOfId');
    await queryInterface.removeColumn('kyc_details', 'backOfIdStatus');
    await queryInterface.removeColumn('kyc_details', 'kycType');
    await queryInterface.removeColumn('kyc_details', 'isManualKycVerified');
  }
};
