const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const otpService = require('../services');
const pick = require('../../../utilities/pick');

const verifyOtpPhone = catchAsync(async (req, res) => {
    const { phoneNumber, email, otpCode } = await pick(req.body, ['phoneNumber', 'email', 'otpCode']);

    const result = await otpService.verifyOtpPhone(phoneNumber, email, otpCode);

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

module.exports = verifyOtpPhone;
