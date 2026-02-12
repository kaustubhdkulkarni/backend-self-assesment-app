const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const subRoleService = require("../services");
const pick = require('../../../utilities/pick');

const addSubRole = catchAsync(async (req, res) => {

	let { subRoleName="" } = await pick(req?.body, ["subRoleName"]);
	let { description } = await pick(req?.body, ["description"]);

	if(!subRoleName || subRoleName===undefined){
		sendResponse(res, httpStatus.BAD_REQUEST, null, "Sub Role Name is required.")
	}
	let addResult = await subRoleService.addSubRole(subRoleName, description)

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

module.exports = addSubRole