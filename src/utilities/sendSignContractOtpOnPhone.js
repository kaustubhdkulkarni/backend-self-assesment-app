const axios = require('axios');

async function sendSignContractOtpOnPhone(otp, mobileNumber) {
    const payload = JSON.stringify({
        "UserID": process.env.ISMART_USER_ID,
        "Password": process.env.ISMART_PASSWORD,
        "Message": `Your OTP from Wadiaa is ${otp}. Please use this OTP to sign your investment contract. This OTP will expire in ${process.env.PHONE_VERIFY_OTP_EXPIRATION_MINUTES || 5} minutes.`,
        "Language": "0",
        "MobileNo": [mobileNumber],
        "RecipientType": "1"
    });

    let config = {
        method: 'post',
        url: `${process.env.ISMART_OTP_ENDPOINT}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: payload
    };

    try {
        const response = await axios.request(config);
        if (response?.status === 201 && response.hasOwnProperty("data") && response?.data?.Code === 1) {
            console.log(`OTP has been sent on ${mobileNumber}.`, response?.data);
            return { status: true, code: 200, data: "OTP sent successfully." };
        } else {
            console.log("Error while sending OTP:", response?.data);
            return { status: false, code: 400, msg: "Error while sending OTP." };
        }
    } catch (error) {
        console.log('Error in sending OTP:', error);
        return { status: false, code: 500, msg: error.message || "Failed to send OTP." };
    }
}

module.exports = sendSignContractOtpOnPhone;
