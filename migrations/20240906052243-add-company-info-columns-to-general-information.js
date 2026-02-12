'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('general_informations', 'legalNameOfCompany', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('general_informations', 'legalTypeOfCompany', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('general_informations', 'sectorOfCompany', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('general_informations', 'companyRegisteredCountry', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('general_informations', 'companyEstablishmentDate', {
      type: Sequelize.DATE,
      allowNull: true,
      validate: {
        isDate: true
      },
    });
    await queryInterface.addColumn('general_informations', 'natureOfCompany', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('general_informations', 'registrationNumberOfCompany', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('general_informations', 'expiryDateOfCompany', {
      type: Sequelize.DATE,
      allowNull: true,
      validate: {
        isDate: true
      }
    });
    await queryInterface.addColumn('general_informations', 'taxIdOfCompany', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('general_informations', 'NoOfEmployeeInCompany', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('general_informations', 'companyContactNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('general_informations', 'companyEmailId', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    });
    await queryInterface.addColumn('general_informations', 'ownershipChangedLast5Years', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('general_informations', 'legalTypeChangeInLast5Years', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('general_informations', 'legalNameOfCompany');
    await queryInterface.removeColumn('general_informations', 'legalTypeOfCompany');
    await queryInterface.removeColumn('general_informations', 'sectorOfCompany');
    await queryInterface.removeColumn('general_informations', 'companyRegisteredCountry');
    await queryInterface.removeColumn('general_informations', 'companyEstablishmentDate');
    await queryInterface.removeColumn('general_informations', 'natureOfCompany');
    await queryInterface.removeColumn('general_informations', 'registrationNumberOfCompany');
    await queryInterface.removeColumn('general_informations', 'expiryDateOfCompany');
    await queryInterface.removeColumn('general_informations', 'taxIdOfCompany');
    await queryInterface.removeColumn('general_informations', 'NoOfEmployeeInCompany');
    await queryInterface.removeColumn('general_informations', 'companyContactNumber');
    await queryInterface.removeColumn('general_informations', 'companyEmailId');
    await queryInterface.removeColumn('general_informations', 'ownershipChangedLast5Years');
    await queryInterface.removeColumn('general_informations', 'legalTypeChangeInLast5Years');
  }
};
