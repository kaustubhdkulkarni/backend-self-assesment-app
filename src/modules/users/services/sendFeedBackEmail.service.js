const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const moment = require("moment")
const { db } = require('../../../db/db');
const { sendFeedBackEmailByUser } = require('./../../../utilities/emailService')

const sendFeedBackEmail = async ({ name, email, message,phone }) => {
	try {

        const sendEmail = await sendFeedBackEmailByUser({name, email, message,phone});
        
        if(sendEmail.status){
            return {
                status: true,
                code: 200,
                data: "Feedback sent successfully."
            }
        }

        return{
            status: false,
            code: 400,
            msg: "Something went wrong."
        }
	} catch (error) {
		console.error("Error while sending feedback email:", error);
		return { msg: error.message, status: false, code: 500 };
	}
};

module.exports = sendFeedBackEmail;
