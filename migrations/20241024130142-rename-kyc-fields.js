'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename columns
    await queryInterface.renameColumn('kyc_details', 'isKYCVerified', 'isMalaasKYCVerified');
    await queryInterface.renameColumn('kyc_details', 'isPhysicalKYCComplete', 'isSmileIDKYCVerified');

    // Change allowNull to false
    await queryInterface.changeColumn('kyc_details', 'isMalaasKYCVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,  // Change allowNull to false
      defaultValue: false,
    });

    await queryInterface.changeColumn('kyc_details', 'isSmileIDKYCVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,  // Change allowNull to false
      defaultValue: false,
    });

    await queryInterface.changeColumn('kyc_details', 'civilNumber', {
      type: Sequelize.STRING,
      allowNull: true,  // Change allowNull to true
    });

    // Remove the expiryDateOfCivil column
    await queryInterface.removeColumn('kyc_details', 'expiryDateOfCivil');

    await queryInterface.addColumn('kyc_details', 'smileIdKYCReceipt', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert column names
    await queryInterface.renameColumn('kyc_details', 'isMalaasKYCVerified', 'isKYCVerified');
    await queryInterface.renameColumn('kyc_details', 'isSmileIDKYCVerified', 'isPhysicalKYCComplete');

    // Change allowNull back to true
    await queryInterface.changeColumn('kyc_details', 'isKYCVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: true,  // Change allowNull back to true
      defaultValue: false,
    });

    await queryInterface.changeColumn('kyc_details', 'isPhysicalKYCComplete', {
      type: Sequelize.BOOLEAN,
      allowNull: true,  // Change allowNull back to true
      defaultValue: false,
    });

    await queryInterface.changeColumn('kyc_details', 'civilNumber', {
      type: Sequelize.STRING,
      allowNull: false,  // Change allowNull to false
    });

    // Re-add the expiryDateOfCivil column if you need to revert the migration
    await queryInterface.addColumn('kyc_details', 'expiryDateOfCivil', {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        isDate: true
      },
    });

    await queryInterface.removeColumn('kyc_details', 'smileIdKYCReceipt');

  }
};
