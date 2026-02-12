const {
    transactionStatus,
    transactionType,
    accountType,
    campaignStatus,
    subRoles,
    currencies,
} = require("../../../config/enums");
const { db } = require("../../../db/db");

const getMyNotifications = async ({ user, page, limit, filter, sort }) => {
    try {

        const pageNumber = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
		const limitNumber = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
		const offset = (pageNumber - 1) * limitNumber;

        let sortBy = ['createdAt', 'DESC'];

        if (typeof sort === 'string') {
            try {
                sortBy = JSON.parse(decodeURIComponent(sort));
            }catch (e) {
                console.error("Invalid sort string:", e);
                sortBy = ['createdAt', 'DESC']
            }
        }else if(Array.isArray(sort) && sort.length > 0){
            sortBy = sort;
        }

        let filterObj = {}
        if (typeof filter === 'string') {
			try {
				filterObj = JSON.parse(decodeURIComponent(filter));
			} catch (e) {
				console.error('Invalid filter string:', e);
				filterObj = {};
			}
		} else if (Array.isArray(filter) && filter.length > 0) {
			filterObj = filter;
		}

        const notification = await db.Notification.findAll({
            where: { userId: user.id, ...filterObj },
            order: [sortBy],
            limit: limitNumber,
            offset: offset
        });

        if (notification?.length === 0) {
            return { msg: "No notifications found ", status: false, code: 404 };
        }

        if (notification.length > 0) {
            const totalResults = await db.Notification.count({where: {userId: user?.id, ...filterObj}})
            const totalPages = Math.ceil(totalResults/limitNumber)
            return {
                data: {
                    notification: notification,
                    totalPages,
                    totalResults,
                    page: pageNumber,
                    limit: limitNumber
                },
                code: 200,
                status: true,
            };
        } else {
            return {
                msg: "Something went wrong, please try again.",
                status: false,
                code: 400,
            };
        }
    } catch (error) {
        console.error("Error while add notification intent:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getMyNotifications;
