const { Op } = require("sequelize");
const { db } = require("../../../db/db");
const UserModel = require("../user.model");
const { roleAccess, roles, accountType, campaignStatus } = require("../../../config/enums");

const getAllUsersList = async () => {
    try {
        // const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        // const limitNumber = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        // const offset = (pageNumber - 1) * limitNumber;

        // let sortBy = ["createdAt", "DESC"];
        // if (typeof sort === "string") {
        //     try {
        //         sortBy = JSON.parse(decodeURIComponent(sort));
        //     } catch (e) {
        //         console.error("Invalid sort string:", e);
        //         sortBy = ["createdAt", "DESC"];
        //     }
        // } else if (Array.isArray(sort) && sort.length > 0) {
        //     sortBy = sort;
        // }

        // let filterQuery = {};
        // let filterObj = {};
        // let includeConditions = [];
        // if (typeof filter === "string") {
        //     try {
        //         filterObj = JSON.parse(decodeURIComponent(filter));
        //     } catch (e) {
        //         console.error("Invalid filter string:", e);
        //         filterObj = {};
        //     }
        // } else if (Array.isArray(filter) && filter.length > 0) {
        //     filterObj = filter;
        // }
        // if (Object.keys(filterObj)?.length) {
        //     if (filterObj?.search && filterObj.search !== undefined) {
        //         filterQuery = {
        //             [Op.or]: [
        //                 { firstName: { [Op.like]: `%${filterObj.search}%` } },
        //                 { lastName: { [Op.like]: `%${filterObj.search}%` } },
        //                 { middleName: { [Op.like]: `%${filterObj.search}%` } },
        //                 { email: { [Op.like]: `%${filterObj.search}%` } },
        //                 { phone: { [Op.like]: `%${filterObj.search}%` } },
        //             ],
        //         };
        //     }
        //     if (filterObj?.accountType && filterObj.accountType !== undefined) {
        //         filterQuery.accountType = filterObj.accountType;
        //     }
        // }
        const userList = await db.Users.findAll({
            where: {
                role: roles.user,
                active: true,
                isAccountLocked: false,
                accountType: accountType.fundraiser,
            },
            include: [
                {
                    model: db.Campaign,
                    as: "campaignInfo",
                    attributes: [],
                    required: false,
                    where: {
                        campaignStatus: {
                            [Op.in]: [campaignStatus.DRAFT, campaignStatus?.WAITING_FOR_REGISTRATION_FEE,
                            campaignStatus?.FUNDRAISING_LIVE, campaignStatus?.TEMPORARILY_SUSPENDED,
                            ]
                        }
                    }
                }
            ],
            attributes: [
                "id",
                "firstName",
                "middleName",
                "lastName",
                "email"
            ],
            having: db.Sequelize.literal('COUNT(campaignInfo.id) = 0'),
            group: ["id"]
        });

        if (userList.length > 0) {
            return {
                data: {
                    users: userList,
                },
                status: true,
                code: 200,
            };
        }

        return {
            status: false,
            code: 404,
            msg: "Users not found.",
        };
    } catch (error) {
        console.error("Error while getting users:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getAllUsersList;
