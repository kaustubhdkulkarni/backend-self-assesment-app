const { transactionStatus } = require('../../../config/enums');
const logger = require('../../../config/logger');
const { db } = require('../../../db/db');
const moment = require("moment")

const deleteExpiredTransactions = async () => {
    try {
        const deletedCount = await db.Transaction.destroy({
            where: {
                transactionStatus: transactionStatus?.PENDING,
                expiryAt: {
                    [db.Sequelize.Op.lt]: moment().subtract(1, "days").toDate(),
                },
            },
        });

        logger.info(`${deletedCount} expired transactions deleted.`);

        return {
            status: true,
            code: 200,
            data: `${deletedCount} expired transactions deleted successfully.`,
        };
    } catch (error) {
        console.error("Error while deleting expired transactions:", error);
        logger.error(`Error while deleting expired transactions: ${error.message}`);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = deleteExpiredTransactions;