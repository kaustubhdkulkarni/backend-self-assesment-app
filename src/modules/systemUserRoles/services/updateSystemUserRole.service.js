const { db } = require("../../../db/db");

const updateSystemUserRole = async ({
  roleId,
  systemUserRoleName,
  modulePermissions,
}) => {
  try {
    const isSystemRoleExist = await db.SystemUserRoles.findOne({
      where: { id: roleId },
    });

    if (!isSystemRoleExist) {
      return {
        status: false,
        code: 404,
        msg: "Provided system user role does not exist.",
      };
    }

    const isRecordExists = await db.SystemUserRoles.findOne({
      where: {
        systemUserRoleName,
        id: { [db.Sequelize.Op.ne]: roleId },
      },
    });

    if (isRecordExists) {
      return {
        status: false,
        code: 400,
        msg: `System user role "${systemUserRoleName}" already exists.`,
      };
    }

    const updateData = {};
    if (systemUserRoleName !== undefined)
      updateData.systemUserRoleName = systemUserRoleName;
    if (modulePermissions !== undefined)
      updateData.modulePermissions = modulePermissions;

    const [updatedRows] = await db.SystemUserRoles.update(updateData, {
      where: { id: roleId },
    });

    if (updatedRows > 0) {
      return {
        status: true,
        code: 200,
        data: "Role updated successfully for system users.",
      };
    } else {
      return {
        status: false,
        code: 400,
        msg: "Error while updating role for system users.",
      };
    }
  } catch (error) {
    console.error("Error while updating role for system users:", error);
    return { msg: error.message, status: false, code: 500 };
  }
};

module.exports = updateSystemUserRole;
