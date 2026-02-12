const { db } = require("../../../db/db");

const addSystemUserRole = async ({ body }) => {
	try {
		const isRecordExists = await db.SystemUserRoles.findOne({
			where: { systemUserRoleName: body?.systemUserRoleName }
		})

		if (isRecordExists) {
			return {
				status: false, code: 400, msg: `System user role "${body?.systemUserRoleName}" already exists.`
			}
		}

		const addRecord = await db.SystemUserRoles.create(body);
		if (addRecord) {
			return {
				status: true,
				code: 201,
				data: "Role added successfully for system users.",
			};
		} else {
			return {
				status: false,
				code: 400,
				data: "Error while add role for system users.",
			};
		}
	} catch (error) {
		console.error("Error while add role for system users:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = addSystemUserRole;
