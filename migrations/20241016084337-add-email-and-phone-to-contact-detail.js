'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('contact_details', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
    });

    await queryInterface.addColumn('contact_details', 'phone', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('contact_details', 'email');
    await queryInterface.removeColumn('contact_details', 'phone');
  }
};
