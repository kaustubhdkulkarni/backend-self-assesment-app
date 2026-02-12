"use strict";

const { accreditationRequestStatus } = require('../src/config/enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("accreditation_requests", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            investmentLimit: {
                type: Sequelize.DECIMAL(11, 4),
                allowNull: true,
            },
            isAccredited: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            accreditationId: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            tag: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            docUrl: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            accreditationRequestStatus: {
                type: Sequelize.ENUM(Object.values(accreditationRequestStatus)),
                allowNull: false,
            },
            remark: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("accreditation_requests");
    },
};
