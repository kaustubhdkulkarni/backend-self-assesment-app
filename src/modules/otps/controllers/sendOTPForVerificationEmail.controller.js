const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const otpService = require('../services'); // Import the service for OTP handling
const pick = require('../../../utilities/pick');

const sendOTPForVerificationEmail = catchAsync(async (req, res) => {
	// Extract email and other necessary parameters from the request body
	let { email = "" } = pick(req?.body, ["email"]);

	// Check if email is provided
	if (!email || email === undefined) {
		return sendResponse(res, httpStatus.BAD_REQUEST, null, "Email is required.");
	}

	let otpResult = await otpService.sendOTPForVerificationEmail(email);

	if (otpResult?.status) {
		sendResponse(res,
			otpResult.code === 201 ? httpStatus.CREATED : httpStatus.OK,
			otpResult?.data?.user ? {
				email: otpResult?.data?.user?.email,
				phone: otpResult?.data?.user?.phone,
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

module.exports = sendOTPForVerificationEmail;