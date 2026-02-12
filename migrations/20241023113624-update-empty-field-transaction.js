'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update existing columns to allow NULL
    await queryInterface.changeColumn('transactions', 'transactionSession', {
      type: Sequelize.STRING,
      allowNull: true,  // Allow NULL values
    });

    await queryInterface.changeColumn('transactions', 'checkoutURL', {
      type: Sequelize.TEXT,
      allowNull: true,  // Allow NULL values
    });

    await queryInterface.changeColumn('transactions', 'expiryAt', {
      type: Sequelize.DATE,
      allowNull: true,  // Allow NULL values
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: Change columns back to NOT NULL if required
    await queryInterface.changeColumn('transactions', 'transactionSession', {
      type: Sequelize.STRING,
      allowNull: false,  // Revert back to NOT NULL
    });

    await queryInterface.changeColumn('transactions', 'checkoutURL', {
      type: Sequelize.TEXT,
      allowNull: false,  // Revert back to NOT NULL
    });

    await queryInterface.changeColumn('transactions', 'expiryAt', {
      type: Sequelize.DATE,
      allowNull: false,  // Revert back to NOT NULL
    }); 
  }
};
