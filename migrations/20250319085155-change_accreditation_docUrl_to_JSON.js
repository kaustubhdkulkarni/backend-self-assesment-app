'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('accreditation_requests', 'docUrl', {
			type: Sequelize.JSON,
			allowNull: true,
			defaultValue: []
		});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('accreditation_requests', 'docUrl', {
			type: Sequelize.STRING,
			allowNull: true,
		});
  }
};
