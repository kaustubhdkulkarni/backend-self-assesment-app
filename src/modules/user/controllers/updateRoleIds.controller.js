const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");
const pick = require("../../../utils/pick");

const updateUser = catchAsync(async (req, res) => {
    console.log('req.body controller',req.body);
	const body = req.body;
    let roleId = req.params.id;
	const user = await service.updateRoleIds(body,roleId)
	if(user) sendResponse(res, httpStatus.OK, "Users RoleIds updated Successfully", null)
	else throw new ApiError(httpStatus.BAD_REQUEST, "Not able to update", false, "")
});

module.exports = updateUser