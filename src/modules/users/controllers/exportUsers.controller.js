const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const userService = require("../services");
const pick = require('../../../utilities/pick');

const exportUsers = catchAsync(async (req, res) => {

	let user = req.user;

	let { sort = {}, page = 1, limit = 10, filter = {} } = await pick(req?.query, ['sort', "page", "limit", "filter"])

	let getResult = await userService.exportUsers(user, sort, page, limit, filter)

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

module.exports = exportUsers