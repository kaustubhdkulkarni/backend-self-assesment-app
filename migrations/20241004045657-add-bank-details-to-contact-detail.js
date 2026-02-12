'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('contact_details', 'bankAccountNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('contact_details', 'bankName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('contact_details', 'bankRoutingCode', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('contact_details', 'currency', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('contact_details', 'isAccountStatusActive', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });

    await queryInterface.addColumn('contact_details', 'isMasterAccountDetails', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('contact_details', 'bankAccountNumber');
    await queryInterface.removeColumn('contact_details', 'bankName');
    await queryInterface.removeColumn('contact_details', 'bankRoutingCode');
    await queryInterface.removeColumn('contact_details', 'currency');
    await queryInterface.removeColumn('contact_details', 'isAccountStatusActive');
    await queryInterface.removeColumn('contact_details', 'isMasterAccountDetails');
  }
};
