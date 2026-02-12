'use strict';

const { gender } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Describe the table to check existing columns
    const table = await queryInterface.describeTable('users');

    // Check if 'middleName' column exists
    if (!table.middleName) {
      await queryInterface.addColumn('users', 'middleName', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }

    // Ensure no NULL values exist in 'dateOfBirth' before changing the column
    await queryInterface.sequelize.query(`
    UPDATE users
    SET dateOfBirth = '1970-01-01' 
    WHERE dateOfBirth IS NULL;
  `);
    await queryInterface.changeColumn('users', 'dateOfBirth', {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    });
    // Ensure no NULL values exist in 'dateOfBirth' before changing the column
    await queryInterface.sequelize.query(`
      UPDATE users
      SET gender = 'male' 
      WHERE gender IS NULL;
    `);
    await queryInterface.changeColumn('users', 'gender', {
      type: Sequelize.ENUM(gender.male, gender.female, gender.other),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'middleName');
    await queryInterface.changeColumn('users', 'dateOfBirth', {
      type: Sequelize.DATE,
      allowNull: true,
      validate: {
        isDate: true
      }
    });
    await queryInterface.changeColumn('users', 'gender', {
      type: Sequelize.ENUM(gender.male, gender.female, gender.other),
      allowNull: true,
    });
  }
};
