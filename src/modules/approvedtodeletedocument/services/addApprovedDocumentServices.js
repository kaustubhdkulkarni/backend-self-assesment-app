const Model = require("../model")
const mongoose = require('mongoose');

async function addApprovedDocument(data) {
    const found = await Model.findOne({documentId:mongoose.Types.ObjectId(data.documentId)})
    if (found) {
        return "deleteReqAlredyExist"
    }
    let created = await Model.create(data)
    return created
}

module.exports = addApprovedDocument