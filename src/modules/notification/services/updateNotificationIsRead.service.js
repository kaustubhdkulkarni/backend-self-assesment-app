const { notificationTypes } = require('../../../config/enums');
const { db } = require('../../../db/db');

const updateNotificationIsRead = async ({ userId, notificationId }) => {

    try {
        const notification = await db.Notification.findOne({ where: { userId: userId, id: notificationId } })

        let campaignData = await db.Campaign.findOne({
            where: { userId: notification?.userId }
        })
        if (notification?.notificationType === notificationTypes?.CAMPAIGN_REGISTRATION_FEE && 
            !campaignData?.isCampaignRegistrationFeePaid
        ) {
            return { status: false, code: 400, msg: "Please pay the registration fee to proceed with your campaign activation." }
        }
        if (!notification) {
            return { status: false, code: 404, msg: "Notification not found." }
        }

        if (notification.isRead) {
            return { status: false, code: 404, msg: "Notification is already read." }
        }

        const updateResult = await notification.update({
            isRead: true
        });

        if (updateResult) {
            return {
                data: "Notification is Read successfully",
                status: true, code: 200
            };
        } else {
            return { msg: "Something went wrong, please try again.", status: false, code: 400 };
        }

    } catch (error) {
        console.error("Error while reading notification", error);
        return { msg: error.message, status: false, code: 500 };
    }

};

module.exports = updateNotificationIsRead;
