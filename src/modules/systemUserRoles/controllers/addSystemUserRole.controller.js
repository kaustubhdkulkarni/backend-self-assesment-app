const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const systemUserRoleServices = require("../services");

const addSystemUserRole = catchAsync(async (req, res) => {
	let body = req?.body

	let addResult = await systemUserRoleServices.addSystemUserRole({ body })
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

module.exports = addSystemUserRole