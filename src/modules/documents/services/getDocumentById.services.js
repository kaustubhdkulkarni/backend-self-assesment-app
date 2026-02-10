const mongoose = require('mongoose');
const Model = require("../documents.model");
const OTMJobProcess = require("../../OTMJobProcess/OTMJobProcess.model");
const ApiError = require('../../../utils/ApiError');
const httpStatus = require('http-status');
const { VIEW_ALL_DOCUMENTS_ACCESS, hasAccess } = require('../../../config/accessModule');
const { getExtractedDataById } = require('../../../utils/fileUpload');

const getUserById = async ({docId,loggedInUser}) => {
        let filterQuery = { _id: mongoose.Types.ObjectId(docId), active: true }

        let restrictViewAllDocument = true
        if (loggedInUser.role != "superAdmin") {
            filterQuery.domainName = { $in: loggedInUser.domain };
            const result = await hasAccess(VIEW_ALL_DOCUMENTS_ACCESS,loggedInUser) 
            if(result) restrictViewAllDocument = false
        }else{
            restrictViewAllDocument = false 
        } 

        if (restrictViewAllDocument) {
            const userId = mongoose.Types.ObjectId(loggedInUser._id) 
            filterQuery ={...filterQuery, assignTo: userId}
        }

        const aggregateQuery = [
            {
                $match: filterQuery,
            },
            {
                $lookup: {
                    from: "shippinglines",
                    localField: "shippingLineId",
                    foreignField: "_id",
                    as: "shippingLine",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "assignTo",
                    foreignField: "_id",
                    as: "assignToUser",
                },
            },
            {
                $unwind: {
                    path: "$shippingLine",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$assignToUser",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    domainName: 1,
                    shippingLineId: 1,
                    documentUrl: 1,
                    documentNo: 1,
                    bookingNo: 1,
                    documentType: 1,
                    document: 1,
                    createdBy: 1,
                    isJobDone: 1,
                    isSuccess: 1,
                    orderType:1,
                    createdAt:1,
                    updatedAt:1,
                    seqId:1,
                    "shippingLine.name": 1,
                    "shippingLine.code": 1,
                    "shippingLine.type": 1,
                    "user.name": 1,
                    "jobs.status": 1,
                    "jobs.startTime": 1,
                    "jobs.endTime": 1,
                    "assignToUser.name": 1,
                    "assignToUser._id": 1,
                    fieldsAndValues: 1,
                    syncWithOtm: 1,
                    lastSyncTime: 1

                },
            },
        ];

        let result = await Model.aggregate(aggregateQuery);
            if (restrictViewAllDocument && !result.length ) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You do not have authorization to access this document", {}, "")
            }

        result = result[0]
        result.extractedData = await getExtractedDataById(result._id)
        
        let jobs = await OTMJobProcess.findOne({documentId: result._id}).sort({_id: -1})

            if(jobs){
                result.jobs = jobs._doc
            }
            if (result) {
                return result
            }else{
                return null
            }
}
module.exports = getUserById