'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('contact_details', 'email', {
      type: Sequelize.STRING,
      allowNull: true, 
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
    });

    await queryInterface.changeColumn('contact_details', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
