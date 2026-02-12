const { db } = require("../db/db");

async function civilExists(civilNumber, user) {
    try {
        let whereCondition = { civilNumber: civilNumber };
        if (user?.id) {
            whereCondition.id = { [db.Sequelize.Op.ne]: user.id }; 
        }

        let civilExistsInUsers = await db.Users.findAll({
            where: whereCondition
        });

        if (civilExistsInUsers?.length > 0) {
            return {
                status: false,
                code: 400,
                msg: `The Document number: ${civilNumber} is already associated with a different account. Please use a document number.`
            };
        }

        let generalInfoCondition = { residenceIDNumber: civilNumber };
        if (user?.id) {
            generalInfoCondition.userId = { [db.Sequelize.Op.ne]: user.id }; // Exclude by user ID
        }

        let civilExistsInGeneralInfo = await db.GeneralInformations.findAll({
            where: generalInfoCondition
        });

        if (civilExistsInGeneralInfo?.length > 0) {
            return {
                status: false,
                code: 400,
                msg: `The Document number: ${civilNumber} is already associated with a different account. Please use a document number.`
            };
        }

        return {
            status: true,
            code: 200,
            data: "Document number is unique."
        };
    } catch (e) {
        console.error("Error while checking if residence/national/passport document exists:", e);
        return { msg: e.message, status: false, code: 500 };
    }
}

module.exports = civilExists;
