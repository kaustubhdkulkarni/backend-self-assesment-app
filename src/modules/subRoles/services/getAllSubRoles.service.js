const { db } = require('../../../db/db');

const getAllUsers = async () => {
	try {

		const subRoleList = await db.SubRoles.findAll({
			include: [
				{
					model: db.InvestmentLimits,
					as: "investmentLimitObj",
				}
			]
		});
		return {
			data: {
				subRoles: subRoleList,
			},
			status: true,
			code: 200
		};
	} catch (error) {
		console.error("Error while getting subRoles:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = getAllUsers;
