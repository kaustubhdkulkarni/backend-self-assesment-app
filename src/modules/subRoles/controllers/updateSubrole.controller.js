const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const subRoleService = require("../services");
const pick = require('../../../utilities/pick');

const updteSubrole = catchAsync(async (req, res) => {

	let { subRoleId } = await pick(req?.params, ["subRoleId"]);
	let { subRoleName="" } = await pick(req?.body, ["subRoleName"]);
	let { description } = await pick(req?.body, ["description"]);

	let addResult = await subRoleService.updteSubrole(subRoleId, subRoleName, description)

	if (addResult?.status) {
		sendResponse(res,
			addResult?.code == 201 ? httpStatus.CREATED
				: httpStatus.OK, addResult?.data, null
		);
	} else {
		sendResponse(res,
			addResult?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: httpStatus.BAD_REQUEST,
			null,
			addResult?.msg
		)
	}
});

module.exports = updteSubrole