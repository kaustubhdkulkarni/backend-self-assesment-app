'use strict';

const { typeOfInterestRate } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('fundraiser_repayments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      fundraiserId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      campaignId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.DECIMAL(11, 4),
        allowNull: false,
      },
      remainingAmount: {
        type: Sequelize.DECIMAL(11, 4),
        allowNull: false,
      },
      typeOfInterestRate: {
        type: Sequelize.ENUM(...Object.values(typeOfInterestRate)),
        allowNull: false,
        defaultValue: typeOfInterestRate.flat,
      },
      interestRateInPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      platformCommission: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      returnOnInvestment: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },
      platformCommissionAmount: {
        type: Sequelize.DECIMAL(11, 4),
        allowNull: true,
      },
      lateFeeInPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      gracePeriodInMonths: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tenureInMonths: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      numberOfInstallment: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      installmentDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      repaymentSchedules: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
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
    await queryInterface.dropTable('fundraiser_repayments');
  }
};
