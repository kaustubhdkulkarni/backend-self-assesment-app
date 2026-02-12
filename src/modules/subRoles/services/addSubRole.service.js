const { db } = require('../../../db/db');

const addSubRole = async (subRoleName, description) => {
	try {
		const subRoleExists = await db.SubRoles.findOne({ where: { subRoleName: subRoleName } });
		if (subRoleExists) {
			return {
				msg: "This sub role name already exists, please use a different sub role name.",
				status: false,
				code: 400
			};
		}
		const newSubRole = await db.SubRoles.create({ subRoleName, ...(description && { description }) });

		if (newSubRole) {
			return {
				data: {
					subRole: newSubRole,
					msg: "Sub Role added successfully."
				},
				status: true, code: 201
			};
		} else {
			return { msg: "Something went wrong, please try again.", status: false, code: 400 };
		}
	} catch (error) {
		console.error("Error while adding Sub Role:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = addSubRole;
