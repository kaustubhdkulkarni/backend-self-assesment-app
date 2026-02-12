const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const usersService = require("../services");
const pick = require('../../../utilities/pick');

const sendFeedBackEmail = catchAsync(async (req, res) => {
	
    const {name, email, message,phone} = await pick(req.body, ["name", "email", "message","phone"]);

	let loginResult = await usersService.sendFeedBackEmail({name, email, message,phone})

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

module.exports = sendFeedBackEmail