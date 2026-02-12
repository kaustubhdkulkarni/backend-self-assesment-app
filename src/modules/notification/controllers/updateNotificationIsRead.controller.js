const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const notificationService = require("../services");
const pick = require('../../../utilities/pick');

const updateNotificationIsRead = catchAsync(async (req, res) => {
    let userId = req.user.id

     let { notificationId = null } = await pick(req?.params, ['notificationId'])

    let addResult = await notificationService.updateNotificationIsRead({userId, notificationId})

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

module.exports = updateNotificationIsRead