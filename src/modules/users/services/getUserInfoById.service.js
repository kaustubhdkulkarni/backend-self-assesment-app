const { Op } = require("sequelize");
const { db } = require("../../../db/db");
const UserModel = require("../user.model");
const { subRoles, accountType } = require("../../../config/enums");

const getUserInfoById = async (userId) => {
    try {
        const userData = await db.Users.findOne({
            where: { id: userId, role: "user" },
            include: [
                {
                    model: db.SubRoles,
                    as: "subRoleObj",
                    attributes: ["id", "subRoleName"],
                },
            ],
        });

        if (!userData) {
            return { msg: "User not found", status: false, code: 404 };
        }

        const includeTable = [
            {
                model: db.SubRoles,
                as: "subRoleObj",
                attributes: ["id", "subRoleName"],
                required: false,
            },
        ];

        if (userData?.subRoleObj?.subRoleName === subRoles?.regularInvestor) {
            includeTable.push(
                {
                    model: db.GeneralInformations,
                    as: "generalInfo",
                },
                {
                    model: db.ContactDetails,
                    as: "contactInfo",
                },
                {
                    model: db.Documents,
                    as: "documentInfo",
                }
            );
        }

        if (userData?.subRoleObj?.subRoleName === subRoles?.businessInvestor) {
            includeTable.push(
                {
                    model: db.GeneralInformations,
                    as: "generalInfo",
                },
                {
                    model: db.ContactDetails,
                    as: "contactInfo",
                },
                {
                    model: db.OwnershipInformation,
                    as: "ownershipInfo",
                },
                {
                    model: db.Documents,
                    as: "documentInfo",
                }
            );
        }
        if (
            userData?.subRoleObj?.subRoleName ===
            subRoles?.sophisticatedInvestor
        ) {
            includeTable.push(
                {
                    model: db.GeneralInformations,
                    as: "generalInfo",
                },
                {
                    model: db.ContactDetails,
                    as: "contactInfo",
                },
                {
                    model: db.Documents,
                    as: "documentInfo",
                }
            );
        }

        if (userData?.accountType === accountType?.fundraiser) {
            includeTable.push(
                {
                    model: db.GeneralInformations,
                    as: "generalInfo",
                },
                {
                    model: db.ContactDetails,
                    as: "contactInfo",
                },
                {
                    model: db.FinancialDetails,
                    as: "financialInfo",
                },
                {
                    model: db.CommercialInformation,
                    as: "commercialInfo",
                },
                {
                    model: db.BankDetails,
                    as: "bankDetails",
                },
                {
                    model: db.CompanyManagement,
                    as: "companyInfo",
                },
                {
                    model: db.Documents,
                    as: "documentInfo",
                }
            );
        }

        const user = await db.Users.findOne({
            where: { id: userId, role: "user" },
            include: includeTable,
        });

        if (!user) {
            return { msg: "User not found", status: false, code: 404 };
        }

        return {
            data: user,
            status: true,
            code: 200,
        };
    } catch (error) {
        console.error("Error while getting user information:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getUserInfoById;
