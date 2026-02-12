'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('documents', 'companyAuthorizationLetterURL', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('documents', 'auditedOwnerfinancialDocURL', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    await queryInterface.renameColumn('documents', 'crNumberDocURL', 'crCertificateDocURL');
    await queryInterface.renameColumn('documents', 'authorisedSignatureListDocURL', 'authorisedSignatureDocURL');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('documents', 'companyAuthorizationLetterURL');
    await queryInterface.removeColumn('documents', 'auditedOwnerfinancialDocURL');
    await queryInterface.renameColumn('documents', 'crCertificateDocURL', 'crNumberDocURL');
    await queryInterface.renameColumn('documents', 'authorisedSignatureDocURL', 'authorisedSignatureListDocURL');
  }
};
