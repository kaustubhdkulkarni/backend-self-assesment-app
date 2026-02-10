const { 
    getWeightFromString,
} = require("../../../utils/AzureFieldExtractionUtils");

const { 
    getContainerListAPI,
    updateContainerAPI,
    remarkCreationSealTypeAPI,
    deleteShipUnitRemarkAPI,
    updateSingleContainerAPI,
    getShipUnitAPI,
    updateOrderReleaseLines,
} = require("../../../utils/otmApiHelper");

const { 
    SHIPPER_SEAL_NUMBER_QUALIFIER,
    LINER_SEAL_NUMBER_QUALIFIER,
    CUSTOM_SEAL_NUMBER_QUALIFIER,
    ORDER_BASSES_ORDER_TYPE,
    ORDER_RELEASES_ORDER_TYPE,
    NEW_STATUS,
 } = require("../services_push_Otm/const");
const { updateJobStatusStep, updateJobStatusQualifier } = require("./service.updateJobStatus");



async function processShipUnitData({
    orderType,
    domainName,
    documentNo,
    extractedField,
    entityDomain,
    carrierType,
    jobId,
    taskCompletionUtils
}) {

    const jobStatusQualifierKey = "ContainerDetails"


    const qty = extractedField.getFieldVal("qty")
    const rate_class = extractedField.getFieldVal("rate_class")
    const w_uom = extractedField.getFieldVal("w_uom")
    const weight = extractedField.getFieldVal("weight")
    const chargeable_weight = extractedField.getFieldVal("chargeable_weight")
    const packagingUnitGid = extractedField.getFieldVal("packagingUnitGid")


    if(orderType === ORDER_RELEASES_ORDER_TYPE) {

        const shipUnitData = await getShipUnitAPI({orderType, domainName, documentNo})
        if(!shipUnitData) {
            await updateJobStatusQualifier({
                qualifier: jobStatusQualifierKey,
                stepKey: "STEP1",
                qualifierStatus: 3,
                value: {
                    status: 3,
                    title: "Ship unit not found",
                    text: `/orderReleases/${domainName}.${documentNo}/shipUnits`
                },
                jobId,
            });

            return
        }

        const shipUnitXid = shipUnitData[0].shipUnitXid


        let orLinesPayload = {
            "weight": {
                "value": Number(weight),
                "unit": w_uom
            },
            "itemPackageCount": Number(qty),
            "netWeight": {
                "value": Number(weight),
                "unit": w_uom
            } 
        }

        if(packagingUnitGid) orLinesPayload["packagingUnitGid"] = packagingUnitGid
        if(qty) orLinesPayload["itemPackageCount"] = Number(qty)

       
        const resOrLines = await updateOrderReleaseLines({shipUnitXid, domainName, documentNo, payload: orLinesPayload})
        if(resOrLines.success){
            await updateJobStatusQualifier({
                qualifier: jobStatusQualifierKey,
                stepKey: `STEP_1`,
                value: {
                    title: "Update Ship Unit Lines",
                    text: documentNo,
                    payload: JSON.stringify(orLinesPayload, null, 4),
                    status: 1
                },
                qualifierStatus: 1,
                jobId,
            });
        } else {
            await updateJobStatusQualifier({
                qualifier: jobStatusQualifierKey,
                stepKey: `STEP_1`,
                value: {
                    title: "Update Ship Unit Lines",
                    text: documentNo,
                    status: 3,
                    payload: JSON.stringify(orLinesPayload, null, 4),
                    response: resOrLines.response
                },
                qualifierStatus: 3,
                jobId,
            });
        }

        // shipUnitCount: Number(qty), // asked to removed 
        let shipUnitPayload = {
            unitWeight: {
                value: Number(weight),
                unit: w_uom,
            },
            unitNetWeight: {
                value: Number(weight),
                unit: w_uom,
            },
            totalGrossWeight: {
                value: Number(weight),
                unit: w_uom,
            },
        };

        const response = await updateContainerAPI({orderType, shipUnitXid, domainName, documentNo, payload: shipUnitPayload})
        if(response.success){
            await updateJobStatusQualifier({
                qualifier: jobStatusQualifierKey,
                stepKey: `STEP_2`,
                value: {
                    title: "Update Ship Units",
                    text: documentNo,
                    payload: JSON.stringify(shipUnitPayload, null, 4),
                    status: 1
                },
                qualifierStatus: 1,
                jobId,
            });
        } else {
            await updateJobStatusQualifier({
                qualifier: jobStatusQualifierKey,
                stepKey: `STEP_2`,
                value: {
                    title: "Update Ship Units",
                    text: documentNo,
                    status: 3,
                    payload: JSON.stringify(shipUnitPayload, null, 4),
                    response: response.response
                },
                qualifierStatus: 3,
                jobId,
            });
        }


        /* Order releases end */
        return
    }
 
    const shipUnitsDataArr = extractedField.getFieldVal("ship_unit_table")
    if(!shipUnitsDataArr) {
        await updateJobStatusQualifier({
            qualifier: jobStatusQualifierKey,
            stepKey: "STEP1",
            qualifierStatus: 3,
            value: {
                status: 3,
                title: NEW_STATUS[jobStatusQualifierKey]["STEP1"].title,
                text: NEW_STATUS[jobStatusQualifierKey]["STEP1"].text
            },
            jobId,
        });

        return
    }

     
    try {
        /* Update Seal and ship unit data */
     let shipUnits = await getContainerListAPI({orderType, domainName, documentNo})
     shipUnits = shipUnits || []

    try {

        
        await updateJobStatusQualifier({
            qualifier: jobStatusQualifierKey,
            stepKey: "STEP2",
            value: {
                status: 1,
                title: NEW_STATUS[jobStatusQualifierKey]["STEP2"].title,
                text: `${shipUnitsDataArr.length} Ship Units found in BL and ${shipUnits.length} Ship units Found ERP`
            },
            jobId,
        });

    } catch (error) {
        
    }
     
    
    if(Array.isArray(shipUnitsDataArr) && shipUnitsDataArr.length){
        
        
        let lastTypeIndexObj = {}
        let sealTypeSuccessCount = 0
        let shipUnitsSuccessCount = 0

         for (let idx = 0; idx < shipUnitsDataArr.length; idx++) {
             const shipUnit = shipUnitsDataArr[idx];
             
             const obShipUnitXid = getObShipUnitXid({documentNo: documentNo, seq: (idx + 1)})


             for (let j = 0; j < shipUnits.length; j++) {
                const shipUnitApi = shipUnits[j];

                
                if(shipUnitApi) {


                    if(shipUnit.type === shipUnitApi.transportHandlingUnitGid) {
                    let data = lastTypeIndexObj[shipUnitApi.transportHandlingUnitGid]
                    if(data){
                        if(data.indexOf(j) != -1) {
                            lastTypeIndexObj[shipUnitApi.transportHandlingUnitGid].push(j)
                                proccedTheShipUnitData()
                        } else {
                            
                        }
                        

                    } else {
                        lastTypeIndexObj[shipUnitApi.transportHandlingUnitGid] = [j]
                        proccedTheShipUnitData()
                    }
                }
    
                    async function proccedTheShipUnitData() {
                        const weightValue = getWeightFromString(shipUnit.weight || "")
                    const transportHandlingUnitGid = shipUnit.type
                    const containerNo = shipUnit.container
                    const mouValue = shipUnit.uom

                    const measurementUom = shipUnit.m_uom
                    const measurementVal = getWeightFromString(shipUnit.measurement || "")
    
                    const attribute18 = shipUnit.item
                    const attribute19 = shipUnit.packageType
                    let attributeNumber1 = shipUnit.packageCount
                    if(typeof shipUnit.packageCount == "string") {
                        attributeNumber1 = Number(shipUnit.packageCount)
                    }
    
    
                    let containerPayload = {
                        attribute18,
                        attribute19,
                        attributeNumber1
                    }

                    if(measurementVal && carrierType === "air") {
                        containerPayload.volume = {
                            value: measurementVal
                        }
                    } 
                    if(measurementUom && carrierType === "air") {
                        if(containerPayload.volume) {
                            containerPayload.volume['unit'] = measurementUom
                        } else {
                            containerPayload.volume = {
                                unit: measurementUom
                            }
                        }
                    }

                    // transportHandlingUnitGid, TODO: not send ask shankar later
                    if (orderType == ORDER_BASSES_ORDER_TYPE) {
                        containerPayload = {
                            ...containerPayload,
                            attribute1: containerNo,
                            weight: {
                                value: weightValue,
                                unit: mouValue,
                            },
                        };
                    }
    
                    // transportHandlingUnitGid, TODO: not send ask later
                    if(orderType == ORDER_RELEASES_ORDER_TYPE){
                        containerPayload = {
                            ...containerPayload,
                            attribute9: containerNo,
                            totalWeight: weightValue,
                            unitWeight: mouValue
                         }
                    }
        
                    console.log("ContainerPayload ::-----------", containerPayload);
                    let jobStatusTitle = NEW_STATUS[jobStatusQualifierKey]["STEP3"].title
                     try {
                        const contUpdateRes = await updateContainerAPI({orderType, domainName, documentNo, payload: containerPayload, shipUnitXid: obShipUnitXid})
                        if(contUpdateRes.success){
                            await updateJobStatusQualifier({
                                qualifier: jobStatusQualifierKey,
                                stepKey: `STEP_${(idx + 1)}`,
                                value: {
                                    title: jobStatusTitle,
                                    text: obShipUnitXid,
                                    payload: JSON.stringify(containerPayload, null, 4),
                                    status: 1
                                },
                                qualifierStatus: 1,
                                jobId,
                            });
    
                            shipUnitsSuccessCount++
    
                        } else {
    
                            await updateJobStatusQualifier({
                                qualifier: jobStatusQualifierKey,
                                stepKey: `STEP_${(idx + 1)}`,
                                value: {
                                    title: jobStatusTitle,
                                    text: obShipUnitXid,
                                    status: 3,
                                    payload: JSON.stringify(containerPayload, null, 4),
                                    response: contUpdateRes.response
                                },
                                qualifierStatus: 3,
                                jobId,
                            });
    
                        }
                        
                        
                     } catch (error) {
                        // console.error(" (3) Error Container Update ", error);
                     }
    
                    /* TODO: DYNA */
                    const itemsArr = []
    
                    if(shipUnit.liner) {
                        await remarkCreationSealTypeUtil({
                            sealNo: shipUnit.liner,
                            jobKey: "LinerSeal",
                            obShipUnitXid,
                            remarkSequence: 1,
                            data: {
                                orderType,
                                domainName,
                                documentNo,
                                shipUnitXid: obShipUnitXid,
                                payload: {
                                    items: [
                                        {
                                            remarkSequence: 1,
                                            remarkQualGid: `${entityDomain}.${LINER_SEAL_NUMBER_QUALIFIER}`,
                                            remarkText: shipUnit.liner,
                                            domainName: domainName,
                                        },
                                    ],
                                },
                            },
                        });
                    }
    
                    if(shipUnit.custom) {
                        await remarkCreationSealTypeUtil({
                            sealNo: shipUnit.custom,
                            jobKey: "CustomSeal",
                            remarkSequence: 2,
                            obShipUnitXid,
                            data: {
                                orderType,
                                domainName,
                                documentNo,
                                shipUnitXid: obShipUnitXid,
                                payload: {
                                    items: [
                                        {  
                                            "remarkSequence": 2,
                                            "remarkQualGid": `${entityDomain}.${CUSTOM_SEAL_NUMBER_QUALIFIER}`,
                                            "remarkText": shipUnit.custom,
                                            "domainName": domainName
                                        }
                                    ],
                                },
                            },
                        });
                    }
    
                    if(shipUnit.shipper) {
                        await remarkCreationSealTypeUtil({
                            sealNo: shipUnit.shipper,
                            jobKey: "ShipperSeal",
                            remarkSequence: 3,
                            obShipUnitXid,
                            data: {
                                orderType,
                                domainName,
                                documentNo,
                                shipUnitXid: obShipUnitXid,
                                payload: {
                                    items: [
                                        {  
                                            "remarkSequence": 3,
                                            "remarkQualGid": `${entityDomain}.${SHIPPER_SEAL_NUMBER_QUALIFIER}`,
                                            "remarkText": shipUnit.shipper,
                                            "domainName": domainName
                                        }
                                    ],
                                },
                            },
                        });
                    }
                    }
                     
                } else {
    
                }
             }

             console.debug("lastTypeIndexObj ::", lastTypeIndexObj);


         }

         if(shipUnitsSuccessCount == shipUnits.length) {
            //  await markTaskCompletion({qualifier: "Seal Type and Ship Units", orderType, jobId, domainName, documentNo})
            /* Temp Commented */
            taskCompletionUtils.taskDone("Seal Type and Ship Units")
         }


 
 
     } else {
         /* Create container here */

         await updateJobStatusQualifier({
            qualifier: jobStatusQualifierKey,
            stepKey: "STEP2",
            value: {
                title: NEW_STATUS[jobStatusQualifierKey]["STEP2"].title,
                text: NEW_STATUS[jobStatusQualifierKey]["STEP2"].title,
                status: 3
            },
            qualifierStatus: 3,
            jobId,
        });
        await updateJobStatusQualifier({
            qualifier: jobStatusQualifierKey,
            stepKey: "STEP3",
            value: {
                title: NEW_STATUS[jobStatusQualifierKey]["STEP3"].title,
                text: NEW_STATUS[jobStatusQualifierKey]["STEP3"].title,
                status: 0
            },
            qualifierStatus: 0,
            jobId,
        });
         
     }
    } catch (error) {
        console.error(" (6) Error Get Ship units Seal Patch ", error);
    }


    async function remarkCreationSealTypeUtil({jobKey, obShipUnitXid, sealNo, data, remarkSequence}) {

        let stepKey = sealNo
        let jobStatusTitle = NEW_STATUS[jobKey]["STEP2"].title
        try {

            let delRes = await deleteShipUnitRemarkAPI({orderType, domainName, documentNo, remarkSequence, obShipUnitXid})
            if(!delRes.success) {
                let delTemResponse = JSON.parse(delRes.response)
                let delJobQualStatus = 3
                if(delTemResponse.status == "404") {
                    delJobQualStatus = 1
                }
                await updateJobStatusQualifier({
                    qualifier: jobKey,
                    stepKey: `${stepKey}_DELETE`,
                    value: {
                        title: "Delete",
                        status: delJobQualStatus,
                        text: `${stepKey} ${obShipUnitXid}`,
                        response: delRes.response,
                        payload: JSON.stringify(data.payload)
                    },
                    jobId,
                });
            }
            
            let res = await remarkCreationSealTypeAPI(data)
            if(res.success){

                await updateJobStatusQualifier({
                    qualifier: jobKey,
                    stepKey: stepKey,
                    value: {
                        title: jobStatusTitle,
                        text: `Seal:${stepKey} Ship unit id: ${obShipUnitXid}`,
                        status: 1
                    },
                    qualifierStatus: 1,
                    jobId,
                });
 
            }else {
                await updateJobStatusQualifier({
                    qualifier: jobKey,
                    stepKey: stepKey,
                    value: {
                        title: jobStatusTitle,
                        status: 3,
                        text: `${stepKey} ${obShipUnitXid}`,
                        response: res.response,
                        payload: JSON.stringify(data.payload)
                    },
                    qualifierStatus: 3,
                    jobId,
                });
            }

            
            
         } catch (error) {
            
            await updateJobStatusQualifier({
                qualifier: jobKey,
                stepKey: stepKey,
                value: {
                    title: jobStatusTitle,
                    status: 3,
                    error: error.message
                },
                qualifierStatus: 3,
                jobId,
            });
         }
    }
    
    function getObShipUnitXid ({documentNo, seq}) {
        const padded = (seq + "").padStart(3, "0");
        return documentNo + "-" + padded
    }
    
}




module.exports = processShipUnitData