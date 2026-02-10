const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const { checkDocumentAndOrderTypeInOTM, checkBookingCancelStatusAPI, getOrderReleaseJobStatusAPI } = require("../../../utils/otmApiHelper")
const Model = require("../documents.model")
const getPrediction = require("./getPrediction.service")
const { isBookingCancelled, isOROrderTypeGidAllowed, isOceanOrderTypeGidAllowed, isJobCreated } = require("../../../utils/AzureFieldExtractionUtils")
const mongoose = require('mongoose');
const shippingLineModal = require("../../shippingLine/shippingLine.model")

async function add(data) {

    const skip_check = process.env.SKIP_DOCUMENT_DUPLICATE_CHECK;
    const { domainName, documentNo, bookingNo, documentType, stageType, shippingLineId } = data 

    const shippingLine = await shippingLineModal.findOne({ _id: mongoose.Types.ObjectId(shippingLineId), active: true })
    if (shippingLine.type == "ocean") {
        let found
        if (stageType == "original") {
                found = await Model.findOne({documentNo: documentNo,documentType:documentType,active:true,domainName:domainName,stageType:stageType})
        }
        if (found) {
            throw new ApiError(httpStatus.FORBIDDEN, found, false)
        }else{

            let {orderType, orderTypeGid, orderReleasesExisted} = await checkDocumentAndOrderTypeInOTM({domainName, documentNo, bookingNo})

            if(!orderType || !isOceanOrderTypeGidAllowed(orderTypeGid)) {
                throw new ApiError(httpStatus.BAD_GATEWAY, "Document not found in otm check Document number", false)
            }

            if(orderReleasesExisted) {
                throw new ApiError(httpStatus.BAD_GATEWAY, "Order is already released", false)
            }
            

            /* START Booking Cancel Check */
            const statusValueGid = await checkBookingCancelStatusAPI({orderType, documentNo, domainName})
            if(isBookingCancelled(statusValueGid)) {
                throw new ApiError(httpStatus.BAD_REQUEST, "This Booking has been cancelled", true, "error")
            }
            /* END  Booking Cancel Check*/


            data["orderType"] = orderType
            data["orderTypeGid"] = orderTypeGid
            let created = await Model.create(data)
            if("created"){
                await getPrediction(created)
            }
            return created
        
        }
    } else if (shippingLine.type == "air"){



        let found
        if (stageType == "original") {
                found = await Model.findOne({documentNo: documentNo,documentType:documentType,active:true,domainName:domainName,stageType:stageType})
        }
        if (found) {
            throw new ApiError(httpStatus.FORBIDDEN, found, false)
        }else{

            let { orderType, orderTypeGid, orderReleasesExisted, orderReleaseXid } = await checkDocumentAndOrderTypeInOTM({domainName, documentNo, bookingNo, type: "air"})

            if(!orderType || !isOROrderTypeGidAllowed(orderTypeGid)) {
                throw new ApiError(httpStatus.BAD_GATEWAY, "Document not found in otm check Document number", false)
            }

            if(!orderReleasesExisted) {
                throw new ApiError(httpStatus.BAD_GATEWAY, "Document not found in ERP", false)
            }
            

            /* START check if job is created */
            const statusValueGid = await getOrderReleaseJobStatusAPI({orderType, documentNo, orderReleaseXid, domainName})
            if(!isJobCreated(statusValueGid)) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Job is created", true, "error")
            }

            data["orderType"] = orderType
            data["orderTypeGid"] = orderTypeGid
            data["documentNo"] = orderReleaseXid
            let created = await Model.create(data)
            if("created"){
                await getPrediction(created)
            }
            return created
        
        }
        
    } else {
        throw new ApiError(httpStatus.BAD_GATEWAY, "Invalid transportation line requested; only shipping and ocean lines are acceptable.", false)
    }
}

module.exports = add