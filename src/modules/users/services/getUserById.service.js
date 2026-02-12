const { db } = require('../../../db/db');

const getUserById = async (id) => {
    try {
       if (!id || id === 'undefined') {
            return { status: false, code: 400, msg: "User ID is required" };
        }
        const userExists = await db.Users.findOne({ where: { id: id }, raw: true });
        return userExists
    } catch (error) {
        console.error("Error while get User by id:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = getUserById;
