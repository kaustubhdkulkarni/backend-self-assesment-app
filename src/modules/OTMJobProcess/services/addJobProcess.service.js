const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../OTMJobProcess.model")
const DocModel = require('../../documents/documents.model')
const ShippingLine = require('../../shippingLine/shippingLine.model')
const mongoose = require('mongoose');
const startProcessPushToOTM = require("./startProcessPushToOTM.service");
const { ExtractedFields, isBookingCancelled } = require("../../../utils/AzureFieldExtractionUtils");
const { getContainerListAPI, getVesselApi, checkBookingCancelStatusAPI } = require("../../../utils/otmApiHelper");
const { VIEW_ALL_DOCUMENTS_ACCESS, hasAccess } = require("../../../config/accessModule")

async function add({documentId, userData}) {
    documentId = mongoose.Types.ObjectId(documentId)
    const createdBy = mongoose.Types.ObjectId(userData._id)

    let findQuery = {documentId: mongoose.Types.ObjectId(documentId), active: true}
    
    const {
        orderType,
        domainName,
        fieldsAndValues,
        documentNo,
        assignTo,
        shippingLineId
    } = await DocModel.findById(documentId)

    const {type: carrierType} = await ShippingLine.findById(shippingLineId)

    let restrictViewAllDocument = true
    if (userData.role === "superAdmin") {
        restrictViewAllDocument = false
    } else {
        if (userData.domain.length) {
            findQuery.domainName = { $in: userData.domain };
            
            const result = await hasAccess(VIEW_ALL_DOCUMENTS_ACCESS,userData) 
            if(result) restrictViewAllDocument = false
        }
    }
    

    if (restrictViewAllDocument && (userData._id.toString() !== assignTo.toString())) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Not able to sync with OTM , You do not have authorization to access this document.", true, "error")
    }
    
    /* START Booking Cancel Check */
    const statusValueGid = await checkBookingCancelStatusAPI({orderType, documentNo, domainName})
    if(isBookingCancelled(statusValueGid)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This Booking has been cancelled", true, "error")
    }
    /* END  Booking Cancel Check*/
    const extractedField = new ExtractedFields(fieldsAndValues)

    if(carrierType === "air") {
        /* Airlines */
        if(!extractedField.getFieldVal("port_of_loading"))  {
            throw new ApiError(httpStatus.BAD_REQUEST, "Valid Airport of Departure is required", true, "error")

        } 
        if(!extractedField.getFieldVal("port_of_discharge"))  {
            throw new ApiError(httpStatus.BAD_REQUEST, "Valid Airport of Destination is required", true, "error")
        } 

    } else {
        const extractedField = new ExtractedFields(fieldsAndValues)

        /* Shipping Line */
        
        /* 
            POR , POL , POD & FINAL DESTINATION
        */
        if(!extractedField.getFieldVal("port_of_loading"))  {
            throw new ApiError(httpStatus.BAD_REQUEST, "Valid Port of Loading is required", true, "error")

        } 
        if(!extractedField.getFieldVal("port_of_discharge"))  {
            throw new ApiError(httpStatus.BAD_REQUEST, "Valid Port of Discharge is required", true, "error")
        } 
        if(!extractedField.getFieldVal("place_of_receipt"))  {
            throw new ApiError(httpStatus.BAD_REQUEST, "Valid Place of Receipt is required", true, "error")
        }
        if(!extractedField.getFieldVal("final_destination"))  {
            throw new ApiError(httpStatus.BAD_REQUEST, "Valid Final Destination is required", true, "error")
        }

        

        let vesselNameData = extractedField.getFieldVal("vessel_name")
        let vesselNameList = await getVesselApi(vesselNameData)

        if(vesselNameList.items.length == 0) {
            let errorMsg = `${vesselNameData} this vessel name is not present in ERP. Kindly create and sync with ERP again`
            if(!vesselNameData) {
                errorMsg = `${vesselNameData} Vessel name missing or incorrect. please check and make correction in fields section`
            }
            throw new ApiError(httpStatus.BAD_REQUEST, errorMsg, true, "error")
        }

        /* START CHECKING EXTRACTED CONTAINER AND OTM CONTAINER SHOULD MATCHES */
        
        let shipUnitsDataArr = extractedField.getFieldVal("ship_unit_table")
        shipUnitsDataArr = shipUnitsDataArr || []
        let otmContainerList = await getContainerListAPI({orderType, domainName, documentNo})
        otmContainerList = otmContainerList || []

        if(shipUnitsDataArr.length > otmContainerList.length) {
            let errorMsg = `${shipUnitsDataArr.length} Ship units found in BL and ${otmContainerList.length} Ship units found ERP, Please correct this and try again`
            throw new ApiError(httpStatus.BAD_REQUEST, errorMsg, true, "error")
        }
        // if(shipUnitsDataArr.length != otmContainerList.length) {
        //     let errorMsg = `${shipUnitsDataArr.length} Ship units found in BL and ${otmContainerList.length} Ship units found ERP, Please correct this and try again`
        //     throw new ApiError(httpStatus.BAD_REQUEST, errorMsg, true, "error")
        // }
        
        /* END CHECKING EXTRACTED CONTAINER AND OTM CONTAINER SHOULD MATCHES _ */

        let rpaContTypeArr = shipUnitsDataArr.map(item=> item.type || '')
        let otmContTypeArr = otmContainerList.map(item=> item.transportHandlingUnitGid)


        if(!checkAllContTypeAreMatching(otmContTypeArr, rpaContTypeArr)) {
            try {
                console.log("otmContTypeArr:", otmContTypeArr.join(', '));
                console.log("rpaContTypeArr:", rpaContTypeArr.join(', '));
            } catch (error) {
                
            }
            let errorMsg = `Container type mismatch detected with OTM. Please ensure that the correct container types are updated.`
            throw new ApiError(httpStatus.BAD_REQUEST, errorMsg, true, "error")
        }

    }
    

    await Model.updateOne(findQuery, {
        $set: {
            active: false
        }
    })

    let defaultData = {
        
    }

    let created = await Model.create({
        documentId: documentId,
        createdBy: createdBy,
        status: defaultData,
        active: true
    })

    if(created && created._id) {

        startProcessPushToOTM(created)
        return created
    } 

    throw new ApiError(httpStatus.BAD_REQUEST, "Not able to push in otm, try again", true, "error")

}

function checkAllContTypeAreMatching(otmArr, rpaArr) {

    function countOccurrences(arr) {
        return arr.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});
    }

    const otmCounts = countOccurrences(otmArr);
    const rpaCounts = countOccurrences(rpaArr);
    console.log("otmCounts", otmCounts);
    console.log("rpaCounts", rpaCounts);
    
    const countMatch = Object.keys(otmCounts).every(type => otmCounts[type] === (rpaCounts[type] || 0));
    return countMatch
}
module.exports = add