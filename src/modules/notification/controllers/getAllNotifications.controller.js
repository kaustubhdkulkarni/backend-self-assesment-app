const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const notificationService = require("../services");
const pick = require('../../../utilities/pick');

const getAllNotifications = catchAsync(async (req, res) => {

    let { page = 1, limit = 10, filter = null, sort = null } = req?.query;

	let addResult = await notificationService.getAllNotifications({page, limit, filter, sort})

	if (addResult?.status) {
		sendResponse(res, httpStatus.CREATED, addResult?.data, null);
	} else {
		sendResponse(res,
			addResult?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: addResult?.code == 404 ? httpStatus.NOT_FOUND
					: addResult?.code == 401 ? httpStatus.UNAUTHORIZED
						: httpStatus.BAD_REQUEST,
			null,
			addResult?.msg
		)
	}
});

module.exports = getAllNotifications