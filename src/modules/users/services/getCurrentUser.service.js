const { Op } = require("sequelize");
const { db } = require("../../../db/db");
const UserModel = require("../user.model");

const getCurrentUser = async (user) => {
  try {
    const foundUser = await db.Users.findOne({
      where: { active: true, id: user?.id },
      include: [
        {
          model: db.SubRoles,
          as: "subRoleObj",
          attributes: ["subRoleName"],
          require: false,
        },
        {
          model: db.AccreditationRequests,
          as: "accreditationRequestObj",
          attributes: ["isAccredited", "accreditationRequestStatus"],
        },
        {
          model: db.SystemUserRoles,
          as: "systemUserRoleObj",
          attributes: ["id", "systemUserRoleName", "modulePermissions"],
          required: false,
        },
      ],
    });

    if (!foundUser) {
      return {
        data: "User not found",
        status: false,
        code: 404,
      };
    }

    return {
      data: foundUser,
      status: true,
      code: 200,
    };
  } catch (error) {
    console.error("Error while getting users:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};


module.exports = getCurrentUser;
