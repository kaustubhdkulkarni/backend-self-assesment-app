const { db } = require('../../../db/db');
const { otpType } = require('../../../config/enums');
const { Op } = require('sequelize');

const verifyOTPEmailAccount = async (email, otpCode) => {
    try {
        const user = await db.Users.findOne({
            where: { email: email, active: true },
            raw: true
        });

        if (!user) {
            return { status: false, code: 404, msg: "Record not found for this email." };
        }
        if (user.isAccountLocked) {
			return { status: false, code: 400, msg: `Your account is locked. ${user?.accountLockingReason}.` };
        }

        // if (user.isEmailVerified) {
        //     return { status: true, code: 200, data: "Your email is already verified." };
        // }

        // Fetch the most recent OTP for the given email
        const otpRecord = await db.Otps.findOne({
            where: {
                email,
                otpFor: otpType.emailVerify,
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
            { where: { email: email } }
        );

        if (updateResult === 0) { // Check if the update was successful
            return { status: false, code: 400, msg: "Something went wrong, please try again." };
        }

        // Delete all OTPs for the email with the same otpFor
        await db.Otps.destroy({
            where: {
                email,
                otpFor: otpType.emailVerify
            }
        });

        return { status: true, code: 200, data: "OTP verified successfully." };
    } catch (error) {
        console.error("Error while verifying OTP:", error);
        return { status: false, code: 500, msg: error.message };
    }
};

module.exports = verifyOTPEmailAccount;
