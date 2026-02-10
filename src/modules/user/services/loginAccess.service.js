const mongoose = require('mongoose');
const User = require('../user.model');
const Token = require('../../auth/token.model');
const { tokenTypes } = require('../../../config/tokens');

const updateUser = async (userId, body) => {
    const result = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId), active: true }, { inActive: body.inActive }, { new: true })
    if (result.inActive) {
        const updateToken = await Token.updateMany({ type:tokenTypes.REFRESH ,user: mongoose.Types.ObjectId(userId), blacklisted: false }, {$set: {blacklisted: true}});
    }
    return result
}

module.exports = updateUser