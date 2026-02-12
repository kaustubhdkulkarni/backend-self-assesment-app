const httpStatus = require("http-status");
const catchAsync = require("../../../utilities/catchAsync");
const sendResponse = require("../../../utilities/responseHandler");
const userService = require("../services");
const pick = require("../../../utilities/pick");

const deleteUser = catchAsync(async (req, res) => {

    const { email, password, reason } = pick(req.body, [ "email", "password", "reason" ]);

    const getResult = await userService.deleteUser(email, password, reason);

    if (getResult?.status) {
        return sendResponse( res, httpStatus.OK, getResult?.data || getResult?.msg, null );
    }

    return sendResponse(
        res,
        getResult?.code === 500
            ? httpStatus.INTERNAL_SERVER_ERROR
                : getResult?.code === 404
                    ? httpStatus.NOT_FOUND
                        : getResult?.code === 401
                            ? httpStatus.UNAUTHORIZED
                                : httpStatus.BAD_REQUEST,
                                    null,
        getResult?.msg
    );
});

module.exports = deleteUser;
