"use strict";

const { investmentStatus } = require("../src/config/enums");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("investments", "investmentStatus", {
            type: Sequelize.ENUM(
                investmentStatus.PENDING,
                investmentStatus.COMPLETED,
                investmentStatus.CANCELED,
                investmentStatus.SIGN_CONTRACT
            ),
            allowNull: false,
            defaultValue: "PENDING",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn("Investments", "investmentStatus", {
            type: Sequelize.ENUM(
                investmentStatus.PENDING,
                investmentStatus.COMPLETED,
                investmentStatus.CANCELED
            ),
            allowNull: false,
            defaultValue: "PENDING",
        });
    },
};
