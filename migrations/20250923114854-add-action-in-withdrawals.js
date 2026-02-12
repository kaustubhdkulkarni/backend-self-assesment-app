'use strict';

/**
 * Migration: Add `actionBy` column to `withdrawals` table
 * The column is VARCHAR(255) and allows NULL.
 * This migration is idempotent: it checks if the column already exists.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get the table description
    const tableDescription = await queryInterface.describeTable('withdrawals');

    // Add the column only if it doesn't exist
    if (!tableDescription.actionBy) {
      await queryInterface.addColumn('withdrawals', 'actionBy', {
        type: Sequelize.STRING(255),  // VARCHAR(255)
        allowNull: true,              // Column allows NULL
        defaultValue: null,           // Default is NULL
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Get the table description
    const tableDescription = await queryInterface.describeTable('withdrawals');

    // Remove the column only if it exists
    if (tableDescription.actionBy) {
      await queryInterface.removeColumn('withdrawals', 'actionBy');
    }
  },
};
