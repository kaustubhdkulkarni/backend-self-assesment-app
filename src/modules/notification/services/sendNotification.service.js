const { transactionStatus, transactionType, accountType, campaignStatus, subRoles, currencies } = require('../../../config/enums');
const { db } = require('../../../db/db');


const sendNotification = async (body) => {
	try {
        
        const userExist = await db.Users.findOne({
            where: {id: body.userId, active: true}
        })

        if(!userExist){
            return { msg: "User does not exist or is inactive.", status: false, code: 404 };
        }
        
		const addResult = await db.Notification.create(body);
        
        if(addResult){
            return {
                data : {
                    notification: addResult,
                    msg: "Notification added successfully"
                },
                status: true, code: 200
            }
        }else{
            return { msg: "Something went wrong, please try again.", status: false, code: 400 };
        }
	} catch (error) {
		console.error("Error while add notification intent:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = sendNotification;