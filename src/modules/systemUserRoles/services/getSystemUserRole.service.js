const { db } = require("../../../db/db");

const getSystemUserRole = async () => {
    try {
        const systemUserRole = await db.SystemUserRoles.findAll();

        if (systemUserRole.length === 0) {
            return {
                status: false,
                code: 404,
                msg: `System user role records not found.`,
            };
        }

        return {
            status: true,
            code: 200,
            data: systemUserRole,
        };
    } catch (error) {
        console.error("Error while add role for system users:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getSystemUserRole;
