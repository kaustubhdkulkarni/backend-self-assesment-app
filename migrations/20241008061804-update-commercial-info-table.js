'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename columns
    await queryInterface.renameColumn('commercial_informations', 'isFinancialInformationCompleted', 'isCommercialInfoCompleted');
    await queryInterface.renameColumn('commercial_informations', 'productsAndServices', 'companyKeyProductsAndServices');

    // Change column type and default value
    await queryInterface.changeColumn('commercial_informations', 'isCommercialInfoCompleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    });

    await queryInterface.changeColumn('commercial_informations', 'companyKeyProductsAndServices', {
      type: Sequelize.JSON,  // Changing to an array of strings
      allowNull: true,
    });

    // Add new fields
    await queryInterface.addColumn('commercial_informations', 'companyTopBuyers', {
      type: Sequelize.JSON,  // Adding new array field
      allowNull: true,
    });

    await queryInterface.addColumn('commercial_informations', 'companyTopSuppliers', {
      type: Sequelize.JSON,  // Adding new array field
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes made in the up migration
    await queryInterface.renameColumn('commercial_informations', 'isCommercialInfoCompleted', 'isFinancialInformationCompleted');
    await queryInterface.renameColumn('commercial_informations', 'companyKeyProductsAndServices', 'productsAndServices');

    // Revert column type and default value
    await queryInterface.changeColumn('commercial_informations', 'isFinancialInformationCompleted', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.changeColumn('commercial_informations', 'productsAndServices', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Remove added fields
    await queryInterface.removeColumn('commercial_informations', 'companyTopBuyers');
    await queryInterface.removeColumn('commercial_informations', 'companyTopSuppliers');
  }
};
