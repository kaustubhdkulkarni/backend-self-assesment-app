'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('kyc_details', 'frontOfIdRemark', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    await queryInterface.addColumn('kyc_details', 'photoRemark', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    await queryInterface.addColumn('kyc_details', 'backOfIdRemark', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('kyc_details', 'frontOfIdRemark');
    await queryInterface.removeColumn('kyc_details', 'photoRemark');
    await queryInterface.removeColumn('kyc_details', 'backOfIdRemark');
  }
};
