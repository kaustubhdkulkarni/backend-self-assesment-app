'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('general_informations', 'middleName', {
			type: Sequelize.STRING,
			allowNull: true,
			after: 'firstName' 
		});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('general_informations', 'middleName');
  }
};
