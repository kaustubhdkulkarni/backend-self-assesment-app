'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('financial_details', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      isFinancialDetailCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      primarySourceOfIncome: {
        type: Sequelize.STRING,
        allowNull: true
      },
      totalJointAssetValue: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      totalPersonalAssetValue: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      totalWealthOwned: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      grossAnnualIncome: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      grossAnnualInvestment: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      projectedValueOfCompany: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      totalAnnualRevenueOfCompany: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      totalAssestValueOfCompany: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      parentCompanyName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      parentCompanyAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('financial_details');
	}
};
