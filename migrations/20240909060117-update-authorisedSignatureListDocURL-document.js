'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('documents', 'authorisedSignatureListDocURL', {
      type: Sequelize.STRING,
      allowNull: true, // Change to true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('documents', 'authorisedSignatureListDocURL', {
      type: Sequelize.STRING,
      allowNull: false, // Revert back to false
    });
  }
};
