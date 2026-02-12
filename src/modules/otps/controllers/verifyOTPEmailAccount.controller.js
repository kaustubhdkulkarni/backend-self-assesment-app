const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const otpService = require('../services');
const pick = require('../../../utilities/pick');

const verifyOTPEmailAccount = catchAsync(async (req, res) => {
    const { email, otpCode } = await pick(req.body, ['email', 'otpCode']);

    const result = await otpService.verifyOTPEmailAccount(email, otpCode);

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

module.exports = verifyOTPEmailAccount;
