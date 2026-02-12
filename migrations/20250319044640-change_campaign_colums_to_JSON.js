'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('campaigns', 'pitchDeck', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'campaignBanner', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'campaignLogo', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'faqDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'termsAndConditionsDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'highlightDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'problemDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'solutionDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'productAndServiceDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'tractionDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'customersDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'businessModelDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'marketDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'competitionDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'strategyDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'fundingDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'teamDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'riskDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.changeColumn('campaigns', 'termsDoc', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: []
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('campaigns', 'pitchDeck', {
      type: Sequelize.STRING, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'campaignBanner', {
      type: Sequelize.STRING, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'campaignLogo', {
      type: Sequelize.STRING, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'faqDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'termsAndConditionsDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'highlightDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'problemDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'solutionDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'productAndServiceDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'tractionDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'customersDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'businessModelDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'marketDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'competitionDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'strategyDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'fundingDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'teamDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'riskDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
    await queryInterface.changeColumn('campaigns', 'termsDoc', {
      type: Sequelize.TEXT, 
      allowNull: true,
    });
  }
};
