const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const { checkDocumentAndOrderTypeInOTM } = require("../../../utils/otmApiHelper")
const Model = require("../documents.model")
const ShippingLineModal = require("../../shippingLine/shippingLine.model")
const getPrediction = require("./getPrediction.service")
const mongo = require("mongoose")
const { isOROrderTypeGidAllowed, isOceanOrderTypeGidAllowed } = require("../../../utils/AzureFieldExtractionUtils")

async function update(data) {
    console.log("data ----", data);
    let docData = data.body
    const {domainName, documentNo} = docData

    const shippingLine = await ShippingLineModal.findOne({ _id: mongo.Types.ObjectId(docData.shippingLineId), active: true })
    if(shippingLine) {

        if(shippingLine.type == "ocean") {
    
            let {orderType, orderTypeGid, orderReleasesExisted} = await checkDocumentAndOrderTypeInOTM({domainName, documentNo})
            if(orderReleasesExisted) {
                throw new ApiError(httpStatus.BAD_GATEWAY, "Order is already released", false)
            }
            if(orderType) {
                if (isOceanOrderTypeGidAllowed(orderTypeGid)) {
                    data["orderType"] = orderType
                    data["orderTypeGid"] = orderTypeGid
                    let result = await Model.updateOne({_id:mongo.Types.ObjectId(data.id)},{$set:{...docData,syncWithOtm:false}})
                    if(result.nModified){
                        let fetchData =  await Model.findById({_id:mongo.Types.ObjectId(data.id)})
                        getPrediction(fetchData)
                        return fetchData
                    }else{
                        return null
                    }
                } else {
                    throw new ApiError(httpStatus.BAD_GATEWAY, "Document not found in otm check Document number", false)
                }
            } else {
                throw new ApiError(httpStatus.BAD_GATEWAY, "Document not found in otm check Document number", false)
            } 
    
    
        } else {
    
    
            let {orderType, orderTypeGid, orderReleasesExisted} = await checkDocumentAndOrderTypeInOTM({domainName, documentNo, type: "air"})
            if(!orderReleasesExisted) {
                throw new ApiError(httpStatus.BAD_GATEWAY, "Document not found in ERP", false)
            }
            if(orderType) {
    
                // /* START Booking Cancel Check */
                //     const statusValueGid = await checkBookingCancelStatusAPI({orderType, documentNo, domainName})
                //     if(isBookingCancelled(statusValueGid)) {
                //         throw new ApiError(httpStatus.BAD_REQUEST, "This Booking has been cancelled", true, "error")
                //     }
                // /* END  Booking Cancel Check*/

                if(isOROrderTypeGidAllowed(orderTypeGid)) {
                    data["orderType"] = orderType
                    data["orderTypeGid"] = orderTypeGid
                    let result = await Model.updateOne({_id:mongo.Types.ObjectId(data.id)},{$set:{...docData,syncWithOtm:false}})
                    if(result.nModified){
                        let fetchData =  await Model.findById({_id:mongo.Types.ObjectId(data.id)})
                        getPrediction(fetchData)
                        return fetchData
                    }else{
                        return null
                    }
                } else {
                    throw new ApiError(httpStatus.BAD_GATEWAY, "Document not found in otm check Document number", false)
                }
                
                
            } else {
                throw new ApiError(httpStatus.BAD_GATEWAY, "Document not found in otm check Document number", false)
            }
    
        }
    } else {
        throw new ApiError(httpStatus.BAD_GATEWAY, "Invalid Shipping line", false)
    }
    
    
}

module.exports = update