const { db } = require("../../../db/db");

const updateSubrole = async (subRoleId, subRoleName, description) => {
    try {
        const subRoleExists = await db.SubRoles.findOne({
            where: { id: subRoleId },
        });

        if (!subRoleExists) {
            return {
                msg: "Subrole not found.",
                status: false,
                code: 404,
            };
        }

        let body = {};
        if (subRoleName) body.subRoleName = subRoleName;

        if (description === null || description === undefined || description === "") {
            body.description = null;  
        } else {
            body.description = description;
        }

        if (Object.keys(body).length === 0) {
            return {
                msg: "No valid fields provided to update.",
                status: false,
                code: 400,
            };
        }

        const updatedSubRole = await subRoleExists.update(body);

        return {
            data: {
                subRole: updatedSubRole,
                msg: "Subrole updated successfully.",
            },
            status: true,
            code: 200, 
        };
    } catch (error) {
        console.error("Error while updating Subrole:", error);
        return {
            msg: "An error occurred while updating the subrole. Please try again.",
            error: error.message,
            status: false,
            code: 500,
        };
    }
};

module.exports = updateSubrole;
