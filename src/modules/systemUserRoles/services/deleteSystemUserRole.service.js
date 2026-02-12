const { db } = require("../../../db/db");

const deleteSystemUserRole = async ({ roleId }) => {
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

        const deletedRows = await db.SystemUserRoles.destroy({
            where: { id: roleId }, 
        });

        if (deletedRows > 0) {
            return {
                status: true,
                code: 200,
                data: "Role deleted successfully for system users.",
            };
        } else {
            return {
                status: false,
                code: 400,
                msg: "Error while deleting role for system users.",
            };
        }
    } catch (error) {
        console.error("Error while deleting role for system users:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = deleteSystemUserRole;
