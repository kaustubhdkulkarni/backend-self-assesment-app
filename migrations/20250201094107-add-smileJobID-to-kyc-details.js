'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn("kyc_details", "smileJobID", {
      type: Sequelize.STRING,
      allowNull: true,
  });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("kyc_details", "smileJobID");
  }
};
