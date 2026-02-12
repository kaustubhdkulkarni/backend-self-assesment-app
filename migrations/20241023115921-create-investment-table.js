'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('investments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      investorId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      investmentAmountInUSD: {
        type: Sequelize.DECIMAL(11, 4),
        allowNull: false,
      },
      campaignId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      transactionId: {
        type: Sequelize.UUID,
        allowNull: false
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('investments');

  }
};
