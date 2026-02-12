const { roles, accountType, campaignStatus } = require("../../../config/enums");
const { db, Op } = require("../../../db/db");
const { getAdminDetails } = require("../../auth/auth.services");

const getAllCount = async (filter) => {
    try {

        let filterObj = {};
        if (typeof filter === "string") {
            try {
                filterObj = JSON.parse(decodeURIComponent(filter));
            } catch (e) {
                console.error("Invalid filter string:", e);
                filterObj = {};
            }
        } else if (Array.isArray(filter) && filter.length > 0) {
            filterObj = filter;
        }

        if (filterObj.startDate && filterObj.endDate) {
            const startDate = new Date(filterObj.startDate);
            const endDate = new Date(filterObj.endDate);
            filterObj.createdAt = {
                [Op.between]: [startDate, endDate],
            };
            delete filterObj.startDate;
            delete filterObj.endDate;
        } else if (filterObj.startDate) {
            const startDate = new Date(filterObj.startDate);
            const endDate = new Date();

            filterObj.createdAt = {
                [Op.between]: [startDate, endDate],
            };

            delete filterObj.startDate;
            delete filterObj.endDate;
        } else if (filterObj.endDate) {
            const endDate = new Date(filterObj.endDate);
            filterObj.createdAt = {
                [Op.lte]: endDate,
            };
            delete filterObj.endDate;
        }

        const adminDetails = await getAdminDetails();
        const adminId = adminDetails?.data?.id || null;

        const [
            totalUsers,
            totalFundraisers,
            totalInvestors,
            totalSystemUsers,
            totalLiveCompaigns,
            adminWallet
        ] = await Promise.all([
            db.Users.count({ where: { role: roles.user, ...filterObj } }),
            db.Users.count({ where: { accountType: accountType.fundraiser, ...filterObj } }),
            db.Users.count({ where: { accountType: accountType.investor, ...filterObj } }),
            db.Users.count({ where: { role: { [Op.in]: [roles.admin, roles?.backofficeUser] }, ...filterObj } }),
            db.Campaign.count({ where: { campaignStatus: campaignStatus.FUNDRAISING_LIVE, ...filterObj } }),
            adminId ? db.Wallet.findOne({ where: { userId: adminId, ...filterObj } }) : null
        ]);

        return {
            status: true,
            code: 200,
            data: {
                totalUsers,
                totalFundraisers,
                totalInvestors,
                totalSystemUsers,
                totalLiveCompaigns,
                adminWallet
            }
        };
    } catch (error) {
        console.error("Error while getting dashboard summary:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getAllCount;