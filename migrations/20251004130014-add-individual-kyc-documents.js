'use strict';

const { kycDocStatus } = require("../src/config/enums");



module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      // Photo Document
      queryInterface.addColumn('kyc_details', 'photoDoc', {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Photo/Selfie document for individual investors'
      }),
      queryInterface.addColumn('kyc_details', 'photoDocStatus', {
        type: Sequelize.ENUM(...Object.values(kycDocStatus)),
        allowNull: true,
      }),
      queryInterface.addColumn('kyc_details', 'photoDocRemark', {
        type: Sequelize.STRING,
        allowNull: true,
      }),

      // Front ID Document
      queryInterface.addColumn('kyc_details', 'frontIdDoc', {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Front side of ID document (passport/national ID/driver license)'
      }),
      queryInterface.addColumn('kyc_details', 'frontIdDocStatus', {
        type: Sequelize.ENUM(...Object.values(kycDocStatus)),
        allowNull: true,
      }),
      queryInterface.addColumn('kyc_details', 'frontIdDocRemark', {
        type: Sequelize.STRING,
        allowNull: true,
      }),

      // Back ID Document
      queryInterface.addColumn('kyc_details', 'backIdDoc', {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Back side of ID document (passport/national ID/driver license)'
      }),
      queryInterface.addColumn('kyc_details', 'backIdDocStatus', {
        type: Sequelize.ENUM(...Object.values(kycDocStatus)),
        allowNull: true,
      }),
      queryInterface.addColumn('kyc_details', 'backIdDocRemark', {
        type: Sequelize.STRING,
        allowNull: true,
      }),

      // Manual KYC Verification Flag
      queryInterface.addColumn('kyc_details', 'isManualKYCVerified', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('kyc_details', 'photoDoc'),
      queryInterface.removeColumn('kyc_details', 'photoDocStatus'),
      queryInterface.removeColumn('kyc_details', 'photoDocRemark'),
      queryInterface.removeColumn('kyc_details', 'frontIdDoc'),
      queryInterface.removeColumn('kyc_details', 'frontIdDocStatus'),
      queryInterface.removeColumn('kyc_details', 'frontIdDocRemark'),
      queryInterface.removeColumn('kyc_details', 'backIdDoc'),
      queryInterface.removeColumn('kyc_details', 'backIdDocStatus'),
      queryInterface.removeColumn('kyc_details', 'backIdDocRemark'),
      queryInterface.removeColumn('kyc_details', 'isManualKYCVerified'),
    ]);
  }
};
