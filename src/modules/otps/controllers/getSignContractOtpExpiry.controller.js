const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const otpServices = require('../services');

const getSignContractOtpExpiry = catchAsync(async (req, res) => {
    const { investmentId } = req.params;
    const userId = req.user.id;

    const result = await otpServices.getSignContractOtpExpiry(investmentId, userId);

    if (result.status) {
        sendResponse(res, httpStatus.OK, result.data, null);
    } else {
        sendResponse(res,
            result.code === 404 ? httpStatus.NOT_FOUND
                : result.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
                    : httpStatus.BAD_REQUEST,
            null,
            result.msg
        );
    }
});

module.exports = getSignContractOtpExpiry

