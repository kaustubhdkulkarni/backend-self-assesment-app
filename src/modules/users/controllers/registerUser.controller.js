const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const usersService = require("../services");

const registerUser = catchAsync(async (req, res) => {
	let body = req?.body || {};

	let addResult = await usersService.registerUser(body)

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

module.exports = registerUser