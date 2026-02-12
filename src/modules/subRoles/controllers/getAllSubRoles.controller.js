const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const subRoleService = require("../services");
const pick = require('../../../utilities/pick');

const getAllSubRoles = catchAsync(async (req, res) => {

	let getResult = await subRoleService.getAllSubRoles()

	if (getResult?.status) {
		sendResponse(res, httpStatus.OK, getResult?.data, null);
	} else {
		sendResponse(res,
			getResult?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: getResult?.code == 404 ? httpStatus.NOT_FOUND
					: httpStatus.BAD_REQUEST,
			null,
			getResult?.msg
		)
	}
});

module.exports = getAllSubRoles