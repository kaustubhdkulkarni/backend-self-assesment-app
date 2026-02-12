const bcrypt = require("bcryptjs");
const decryptPassword = require("../../../utilities/decryptPassword");
const { db } = require("../../../db/db");
const { date } = require("joi");

const deleteUser = async (email, password, reason) => {
    try {

        if (!email || !password || !reason) {
            return {
                status: false,
                code: 400,
                msg: "Email, password, and reason are required.",
            };
        }

        const user = await db.Users.scope('withPassword').findOne({
            where: { email },
        });

        if (!user) {
            return {
                status: false,
                code: 404,
                msg: "User not found.",
            };
        }

        if (user.isAccountDeleted) {
            return {
                status: false,
                code: 400,
                msg: "User account is already deleted.",
            };
        }

        if (!user.active) {
            return {
                status: false,
                code: 400,
                msg: "User is already inactive.",
            };
        }

        const decryptedPassword = await decryptPassword(password);
        const isMatch = await bcrypt.compare(decryptedPassword, user.password);

        if (!isMatch) {
            return {
                status: false,
                code: 400,
                msg: "Incorrect password.",
            };
        }


        const deleteResult = await user.update({
            isAccountDeleted: true,
            deletionReason: reason,
        });

        if(deleteResult){
            return {
                status: true,
                code: 200,
                data: "User deleted successfully.",
            };
        }else{
            return {
                status: false,
                code: 400,
                msg: "Something went wrong",
            };
        }

    } catch (error) {
        console.error("Error while deleting user:", error);
        return {
            status: false,
            code: 500,
            msg: error.message,
        };
    }
};

module.exports = deleteUser;
