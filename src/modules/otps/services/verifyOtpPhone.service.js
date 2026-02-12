const { db } = require('../../../db/db');
const { otpType } = require('../../../config/enums');
const { Op } = require('sequelize');

const verifyOtpPhone = async (phoneNumber, email, otpCode) => {
    try {
        const user = await db.Users.findOne({
            where: { phone: phoneNumber, email: email, active: true },
            raw: true
        });

        if (!user) {
            return { status: false, code: 404, msg: "Record not found for this phone number." };
        }
        if (user.isAccountLocked) {
            return { status: false, code: 400, msg: `Your account is locked. ${user?.accountLockingReason}.` };
        }

        // if (user.isMobileVerified) {
        //     return { status: true, code: 200, data: "Your phone number is already verified." };
        // }

        // Fetch the most recent OTP for the given phone number
        const otpRecord = await db.Otps.findOne({
            where: {
                phoneNumber,
                email,
                otpFor: otpType.phoneVerify,
                otpCode,
                expiresAt: { [Op.gt]: new Date() } // Ensure OTP has not expired
            },
            order: [['createdAt', 'DESC']],
            raw: true
        });

        if (!otpRecord) {
            return { status: false, code: 400, msg: "Invalid or expired OTP." };
        }

        const [updateResult] = await db.Users.update(
            { isMobileVerified: true, isEmailVerified: true },
            { where: { phone: phoneNumber } }
        );

        if (updateResult === 0) { // Check if the update was successful
            return { status: false, code: 400, msg: "Something went wrong, please try again." };
        }

        // Delete all OTPs for the phone number with the same otpFor
        await db.Otps.destroy({
            where: {
                phoneNumber,
                email,
                otpFor: otpType.phoneVerify
            }
        });

        return { status: true, code: 200, data: "OTP verified successfully." };
    } catch (error) {
        console.error("Error while verifying OTP:", error);
        return { status: false, code: 500, msg: error.message };
    }
};

module.exports = verifyOtpPhone;
