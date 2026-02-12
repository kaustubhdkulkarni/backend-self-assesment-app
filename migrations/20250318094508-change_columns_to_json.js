'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('documents', 'residenceOrTaxIdDocURL', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('documents', 'passportDocURL', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('documents', 'crCertificateDocURL', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('documents', 'authorisedSignatureDocURL', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('documents', 'companyAuthorizationLetterURL', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('documents', 'auditedOwnerfinancialDocURL', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('documents', 'bankStatement', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('documents', 'companyProfile', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('documents', 'idDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('documents', 'proofOfSalary', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('documents', 'residenceOrTaxIdDocURL', {
      type: Sequelize.STRING, 
      allowNull: true,
    });
    await queryInterface.changeColumn('documents', 'passportDocURL', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('documents', 'crCertificateDocURL', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('documents', 'authorisedSignatureDocURL', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('documents', 'companyAuthorizationLetterURL', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('documents', 'auditedOwnerfinancialDocURL', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('documents', 'bankStatement', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('documents', 'companyProfile', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('documents', 'idDoc', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('documents', 'proofOfSalary', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
