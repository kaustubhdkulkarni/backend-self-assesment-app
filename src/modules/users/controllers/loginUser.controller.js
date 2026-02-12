const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const usersService = require("../services");

const loginUser = catchAsync(async (req, res) => {
	let body = req?.body || {};	

	let loginResult = await usersService.loginUser({ body })

	if (loginResult?.status) {
		sendResponse(res, httpStatus.OK, loginResult?.data, null
		);
	} else {
		sendResponse(res,
			loginResult?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: loginResult?.code == 404 ? httpStatus.NOT_FOUND
					: loginResult?.code == 401 ? httpStatus.UNAUTHORIZED
						: httpStatus.BAD_REQUEST,
			null,
			loginResult?.msg
		)
	}
});

module.exports = loginUser