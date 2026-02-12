const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const systemUserRoleServices = require("../services");
const pick = require('../../../utilities/pick');

const deleteSystemUserRole = catchAsync(async (req, res) => {

    let { roleId = null } = await pick(req.params, ["roleId"])

	let addResult = await systemUserRoleServices.deleteSystemUserRole({roleId })
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

module.exports = deleteSystemUserRole