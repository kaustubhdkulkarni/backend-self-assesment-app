"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("campaigns", "faqDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn(
            "campaigns",
            "termsAndConditionsDoc",
            { type: Sequelize.TEXT, allowNull: true }
        );
        await queryInterface.changeColumn("campaigns", "highlightTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "highlightDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "problemTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "problemDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "solutionTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "solutionDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn(
            "campaigns",
            "productAndServiceTitle",
            { type: Sequelize.TEXT, allowNull: true }
        );
        await queryInterface.changeColumn("campaigns", "productAndServiceDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "tractionTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "tractionDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "customersTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "customersDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "businessModelTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "businessModelDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "marketTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "marketDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "competitionTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "competitionDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "strategyTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "strategyDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "fundingTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "fundingDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "riskTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "riskDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "teamTitle", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "teamDoc", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn("campaigns", "faqDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn(
            "campaigns",
            "termsAndConditionsDoc",
            { type: Sequelize.STRING, allowNull: true }
        );
        await queryInterface.changeColumn("campaigns", "highlightTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "highlightDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "problemTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "problemDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "solutionTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "solutionDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn(
            "campaigns",
            "productAndServiceTitle",
            { type: Sequelize.STRING, allowNull: true }
        );
        await queryInterface.changeColumn("campaigns", "productAndServiceDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "tractionTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "tractionDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "customersTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "customersDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "businessModelTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "businessModelDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "marketTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "marketDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "competitionTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "competitionDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "strategyTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "strategyDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "fundingTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "fundingDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "riskTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "riskDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "teamTitle", {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.changeColumn("campaigns", "teamDoc", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
};
