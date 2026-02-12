const { where } = require('sequelize');
const { db } = require('../../../db/db');
const civilExists = require('../../../utilities/civilExists');

const updaterUser = async (id, body) => {
    try {
        const userExists = await db.Users.findOne({
            where: { id: id, active: true },
            include: [
                {
                    model: db.SubRoles,
                    as: "subRoleObj",
                    attributes: ['subRoleName'],
                    require: false
                }
            ],
        });
        if (!userExists) {
            return {
                msg: `User not found.`,
                status: false,
                code: 400
            };
        }
        if (body.civilNumber) {
            let checkCivilExist = await civilExists(body?.civilNumber, userExists);
            if (!checkCivilExist?.status) {
                return { status: false, code: 400, msg: checkCivilExist?.msg }
            }
        }

        let checkSubRoleExists
        if (body.hasOwnProperty('subRoleId')) {
            checkSubRoleExists = await db.SubRoles.findOne({ where: { id: body.subRoleId } })
            if (!checkSubRoleExists) {
                return {
                    status: false, code: 400,
                    msg: `Investor type not exists, please provide valid investor type.`
                }
            }
        }
        if (userExists?.subRoleId && body.hasOwnProperty("subRoleId")) {
            return {
                status: false, code: 400,
                msg: `Investor type already assigned for this account.`
            }
        }

        const updatedUser = await userExists.update(body);

        if (updatedUser) {
            return {
                data: {
                    user: updatedUser,
                    msg: "User details updated successfully."
                },
                status: true, code: 201
            };
        } else {
            return { msg: "Something went wrong, please try again.", status: false, code: 400 };
        }
    } catch (error) {
        console.error("Error while updated User:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = updaterUser;
