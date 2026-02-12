const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const notificationService = require("../services");
const pick = require('../../../utilities/pick');

const sendNotification = catchAsync(async (req, res) => {

	let body = await pick(req?.body, ["userId", "message", "notificationType"])

	let addResult = await notificationService.sendNotification(body)

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

module.exports = sendNotification