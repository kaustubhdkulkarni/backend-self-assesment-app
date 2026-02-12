const axios = require('axios');
const logger = require('../config/logger');

async function sendOtpOnMobile(otp, mobileNumber, email) {
	const payload = JSON.stringify({
		"UserID": process.env.ISMART_USER_ID,
		"Password": process.env.ISMART_PASSWORD,
		"Message": `Your OTP from Wadiaa is ${otp}. Please use this OTP to verify your account linked to your phone: ${mobileNumber} and email: ${email}. This OTP is valid for ${process.env.PHONE_VERIFY_OTP_EXPIRATION_MINUTES || 5} minutes.`,
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

			logger.info(`OTP sent successfully to ${mobileNumber} (email: ${email}). Provider response: ${JSON.stringify(response?.data)}`);
			console.log(`And otp has been sent on ${mobileNumber} linked to email ${email}.`, response?.data);
			return { status: true, code: 200, data: "Otp Sent." };
		} else {
			console.log("Error while sending otp:", response?.data);
			return { status: false, code: 400, msg: "Error while sending otp." }
		}
	} catch (error) {
		logger.error(`Error in sending OTP to ${mobileNumber}:::, ${error?.message}`); // Use logger for error details
		console.log('Error in sending OTP:::', error);
		return error;
	}
}

module.exports = sendOtpOnMobile