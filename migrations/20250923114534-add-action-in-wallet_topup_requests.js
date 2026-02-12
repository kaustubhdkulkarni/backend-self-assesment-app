'use strict';

/**
 * Migration: Add `actionBy` column to `wallet_topup_requests` table
 * The column is VARCHAR(255) and allows NULL.
 * This migration is idempotent: it checks if the column already exists.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get the table description
    const tableDescription = await queryInterface.describeTable('wallet_topup_requests');

    // Add the column only if it doesn't exist
    if (!tableDescription.actionBy) {
      await queryInterface.addColumn('wallet_topup_requests', 'actionBy', {
        type: Sequelize.STRING(255),  // VARCHAR(255)
        allowNull: true,              // Column allows NULL
        defaultValue: null,           // Default is NULL
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Get the table description
    const tableDescription = await queryInterface.describeTable('wallet_topup_requests');

    // Remove the column only if it exists
    if (tableDescription.actionBy) {
      await queryInterface.removeColumn('wallet_topup_requests', 'actionBy');
    }
  },
};
