const mongoose = require('mongoose');
const User = require('../user.model');

const updateUser = async (body,roleId) => {
    let idArray = Object.values(body).map(id => mongoose.Types.ObjectId(id));
    const updatedResult = await User.updateMany({ _id: { $in: idArray }, active: true },{$set: {roleId}})
    return updatedResult   
}

module.exports = updateUser