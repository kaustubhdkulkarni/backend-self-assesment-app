const mongoose = require('mongoose');
const User = require("../user.model");

const removeRoleId = async (id) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true }
        return await User.findOneAndUpdate(filterQuery, { roleId :  null})
    } catch (error) {
        return null
    }
}
module.exports = removeRoleId