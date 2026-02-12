'use strict';

const { campaignStatus } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('campaigns', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      campaignStatus: {
        type: Sequelize.ENUM(...Object.values(campaignStatus)),
        allowNull: true,
        default: campaignStatus?.DRAFT
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      targetAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      campaignType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      campaignDurationInDays: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      remark: {
        type: Sequelize.STRING,
        allowNull: true
      },
  
      pitchDeck: {
        type: Sequelize.STRING,
        allowNull: true
      },
      campaignBanner: {
        type: Sequelize.STRING,
        allowNull: true
      },
      campaignLogo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      campaignLink: {
        type: Sequelize.STRING,
        allowNull: true
      },
  
      faqDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      termsAndConditionsDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      highlightTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      highlightDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      problemTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      problemDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      solutionTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      solutionDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      productAndServiceTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      productAndServiceDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tractionTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tractionDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customersTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customersDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      businessModelTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      businessModelDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      marketTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      marketDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      competitionTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      competitionDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      strategyTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      strategyDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fundingTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fundingDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      riskTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      riskDoc: {
        type: Sequelize.STRING,
        allowNull: true
      },
      teamTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      teamDoc: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('campaigns');
  }
};
