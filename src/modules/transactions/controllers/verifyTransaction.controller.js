const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const transactionService = require("../services");
const pick = require('../../../utilities/pick');

const verifyTransaction = catchAsync(async (req, res) => {
	let user = req?.user
	let { checkoutSessionId = null } = await pick(req?.params, ['checkoutSessionId'])

	let addResult = await transactionService.verifyPaymobTransaction(user, checkoutSessionId)

	if (addResult?.status) {
		sendResponse(res, httpStatus.OK, addResult?.data, null);
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

module.exports = verifyTransaction