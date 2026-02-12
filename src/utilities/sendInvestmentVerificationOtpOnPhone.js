const axios = require('axios');

async function sendInvestmentVerificationOtpOnPhone(otp, mobileNumber) {
	const payload = JSON.stringify({
		"UserID": process.env.ISMART_USER_ID,
		"Password": process.env.ISMART_PASSWORD,
		"Message": `Your OTP from Wadiaa is ${otp}. Please use this OTP to complete your investment verification process. This OTP will expire in ${process.env.PHONE_VERIFY_OTP_EXPIRATION_MINUTES || 5} minutes.`,
		"Language": "0",
		"MobileNo": [mobileNumber],
		"RecipientType": "1"
	});

	let config = {
		method: 'post',
		// maxBodyLength: Infinity,
		url: `${process.env.ISMART_OTP_ENDPOINT}`,
		headers: {
			'Content-Type': 'application/json'
		},
		data: payload
	};

	try {
		const response = await axios.request(config);
		if (response?.status === 201 && response.hasOwnProperty("data") && response?.data?.Code === 1) {
			console.log(`And otp has been sent on ${mobileNumber}.`, response?.data);
			return { status: true, code: 200, data: "Otp Sent." };
		} else {
			console.log("Error while sending otp:", response?.data);
			return { status: false, code: 400, msg: "Error while sending otp." }
		}
	} catch (error) {
		console.log('Error in sending OTP:::', error);
		return error;
	}
}

module.exports = sendInvestmentVerificationOtpOnPhone