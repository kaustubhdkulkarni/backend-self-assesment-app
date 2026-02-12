'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'expiryDateOfCivilNumber', {
			type: Sequelize.DATE,
			allowNull: true,
      validate: {
        isDate: true,
      },
		});

		await queryInterface.addColumn('users', 'civilNumber', {
			type: Sequelize.STRING,
			allowNull: true,
		});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'expiryDateOfCivilNumber');
		await queryInterface.removeColumn('users', 'civilNumber');
  }
};
