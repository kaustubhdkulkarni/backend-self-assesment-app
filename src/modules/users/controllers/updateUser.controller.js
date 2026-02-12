const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const usersService = require("../services");
const { roles } = require('../../../config/enums');

const updateUser = catchAsync(async (req, res) => {
    let body = req?.body || {};
    let id = req.user.id;
    if(req.user?.role!==roles.user){
        sendResponse(res,
            httpStatus.BAD_REQUEST,
            null,
            "User not with user role are not permitted to update the account details."
        )
    }

    let addResult = await usersService.updateUser(id, body);

    if (addResult?.status) {
        sendResponse(res,
            addResult?.code == 201 ? httpStatus.CREATED
                : httpStatus.OK, addResult?.data, null
        );
    } else {
        sendResponse(res,
            addResult?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR
                : httpStatus.BAD_REQUEST,
            null,
            addResult?.msg
        )
    }
});

module.exports = updateUser