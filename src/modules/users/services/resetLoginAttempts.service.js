const logger = require("../../../config/logger");
const { db, Op } = require("../../../db/db");
const moment = require('moment');

const resetLoginAttempts = async () => {
    try {
        let users = await db.Users.findAll({
            where: {
                [Op.or]: [
                    { loginAttempts: { [Op.gt]: 0 } },
                    { isAccountLocked: true },
                    { lockedUntil: { [Op.gt]: moment().format() } }
                ]
            }
        })

        if (!users?.length) {
            logger.warn("No users found with failed login attempts.")
            return {
                status: false, code: 400, msg: "No users found with failed login attempts."
            }
        }

        for (let user of users) {
            let updatePayload = {}
            if (user?.lockedUntil && user?.isAccountLocked
                && moment(user?.lockedUntil).format() < moment().format()
            ) {
                updatePayload = {
                    ...updatePayload,
                    lockedUntil: null, isAccountLocked: false,
                    accountLockingReason: "", loginAttempts: 0
                }
            } else if (!user?.lockedUntil && !user?.isAccountLocked
                && user?.loginAttempts > 0
            ) {
                updatePayload = {
                    ...updatePayload,
                    accountLockingReason: "", loginAttempts: 0

                }
            }
            await user.update(updatePayload)
        }

        logger.info("Successfully reset login attempts for affected users.");
    } catch (error) {
        logger.error("An error occurred while resetting failed login attempts:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = resetLoginAttempts;