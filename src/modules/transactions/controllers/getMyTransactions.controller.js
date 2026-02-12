const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const transactionService = require("../services");

const getMyTransactions = catchAsync(async (req, res) => {
	let { page = 1, limit = 10, filter = null, sort = null } = req?.query;

	let user = req.user;

	let getResult = await transactionService.getMyTransactions({
		user, page, limit, filter, sort
	})

	if (getResult?.status) {
		sendResponse(res, httpStatus.OK, getResult?.data, null);
	} else {
		sendResponse(res,
			getResult?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
				: getResult?.code == 404 ? httpStatus.NOT_FOUND
					: getResult?.code == 401 ? httpStatus.UNAUTHORIZED
						: httpStatus.BAD_REQUEST,
			null,
			getResult?.msg
		)
	}
});

module.exports = getMyTransactions