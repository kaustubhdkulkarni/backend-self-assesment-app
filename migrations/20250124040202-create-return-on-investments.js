'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('return_on_investments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      investorId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      amountReturned: {
        type: Sequelize.DECIMAL(20, 6),
        allowNull: false,
      },
      interestEarned: {
        type: Sequelize.DECIMAL(20, 6),
        allowNull: false,
      },
      installmentId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      repaymentId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      campaignId: {
        type: Sequelize.UUID,
        allowNull: false,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('return_on_investments');
  }
};
