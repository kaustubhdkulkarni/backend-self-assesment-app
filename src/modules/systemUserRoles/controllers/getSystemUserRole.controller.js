const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const systemUserRoleServices = require("../services");

const getSystemUserRole = catchAsync(async (req, res) => {

	let addResult = await systemUserRoleServices.getSystemUserRole()
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

module.exports = getSystemUserRole