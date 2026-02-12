const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const transactionService = require("../services");
const pick = require('../../../utilities/pick');

const payInstallment = catchAsync(async (req, res) => {

	let { installmentId = null } = await pick(req?.params, ["installmentId"]);
	let { repaymentId = null } = await pick(req?.body, ['repaymentId']);
	let user = req?.user
	// if (!notificationId || notificationId === undefined) {
	// 	sendResponse(res, httpStatus.BAD_REQUEST, null, "Notification Id required to create checkout url.")
	// }
	let addResult = await transactionService.payInstallment({user, repaymentId, installmentId})

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

module.exports = payInstallment