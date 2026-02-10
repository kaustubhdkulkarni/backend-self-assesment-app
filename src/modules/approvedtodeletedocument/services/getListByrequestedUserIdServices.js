const mongoose = require('mongoose');
const Model = require("../model");
const { getAccessModulesFn } = require('../../auth/auth.service');
const { VIEW_ALL_DOCUMENTS_ACCESS, hasAccess } = require('../../../config/accessModule');

const getDocumentByRequestedId = async ({ limit = 100, page = 0 ,status,userData}) => {
    try {
        let filterQuery = { active: true,};

        limit = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * limit;

        let domainQuery = { $and: [{active : true}] }
        let restrictViewAllDocument = true
        if (userData.role === "superAdmin") {
            restrictViewAllDocument = false
        } else {
            if (userData.domain.length) {
                domainQuery.$and.push({ "documentsDetails.domainName": { $in: userData.domain }})

                const result = await hasAccess(VIEW_ALL_DOCUMENTS_ACCESS,userData) 
                if(result) restrictViewAllDocument = false
            }
        }

        if (status == "deleted") {
            filterQuery.isDeleted = true;
        }else{
            filterQuery.isDeleted = false;
        }
        if (restrictViewAllDocument) {
            filterQuery.requestedBy = mongoose.Types.ObjectId(userData._id);
        }

        const aggregateQuery = [
            {
                $match: filterQuery,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "requestedBy",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "deletedBy",
                    foreignField: "_id",
                    as: "deleteUserDetails",
                },
            },
            {
                $lookup: {
                    from: "documents",
                    localField: "documentId",
                    foreignField: "_id",
                    as: "documentsDetails",
                },
            },
            {
                $unwind: {
                    path: "$documentsDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$deleteUserDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $match: domainQuery
            },

            {
                $project: {
                    isDeleted: 1,
                    requestedBy: 1,
                    documentId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "userDetails.name": 1,
                    "userDetails._id": 1,
                    "deleteUserDetails.name": 1,
                    "deleteUserDetails._id": 1,
                    "documentsDetails.name": 1,
                    "documentsDetails._id": 1,
                    "documentsDetails.documentNo": 1,
                    "documentsDetails.fieldsAndValues": 1,
                    "documentsDetails.orderTypeGid": 1,
                    "documentsDetails.domainName": 1,
                    "documentsDetails.documentType": 1,
                },
            },
        ];
    

        const list = await Model.aggregate(aggregateQuery)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)

        const totalCount = await Model.countDocuments(filterQuery);
        return {
            data: list,
            totalCount: list.length,
            page,
            limit,
        };

    } catch (error) {
        console.log("ERorr",error);
        return false;
    }
}

module.exports = getDocumentByRequestedId;
