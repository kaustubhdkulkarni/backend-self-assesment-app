const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const otpService = require('../services'); // Import the service for OTP handling
const pick = require('../../../utilities/pick');

const sendOtpForVerification = catchAsync(async (req, res) => {
	// Extract phoneNumber and other necessary parameters from the request body
	let { phoneNumber = "", email="" } = pick(req?.body, ["phoneNumber",'email']);

	// Check if phoneNumber is provided
	if (!phoneNumber || phoneNumber === undefined) {
		return sendResponse(res, httpStatus.BAD_REQUEST, null, "Phone number is required.");
	}
	if (!email || email === undefined) {
		return sendResponse(res, httpStatus.BAD_REQUEST, null, "Email is required.");
	}

	let otpResult = await otpService.sendOtpForVerification(phoneNumber, email);

	if (otpResult?.data?.otpCode) {
		delete otpResult.data.otpCode;
	}

	if (otpResult?.status) {
		sendResponse(res,
			otpResult.code === 201 ? httpStatus.CREATED : httpStatus.OK,
			otpResult?.data?.user ? {
				phone: otpResult?.data?.user?.phone,
				email: otpResult?.data?.user?.email,
				msg: otpResult?.data?.msg
			} : otpResult.data,
			null
		);
	} else {
		sendResponse(res,
			otpResult.code === 404 ? httpStatus.NOT_FOUND
				: otpResult.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
					: httpStatus.BAD_REQUEST,
			null,
			otpResult.msg
		);
	}
});

module.exports = sendOtpForVerification;