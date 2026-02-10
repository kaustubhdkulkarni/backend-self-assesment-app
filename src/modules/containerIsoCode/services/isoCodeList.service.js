const { getContainerListAPI } = require('../../../utils/otmApiHelper');
const IsoCodeModel = require('../isoCodes.model')

async function getAllIsoCode({search, documentNo, domainName, orderType = "orderBases"}) {
    /* From booking */
    let tempKeyObj = {}
    try {

        /* Mostly it is applied for orderReleases */
       let itemData = await getContainerListAPI({orderType, domainName, documentNo})
       itemData = itemData || []
       itemData = itemData.map(item => {
            tempKeyObj[item.transportHandlingUnitGid] = {
                code: item.transportHandlingUnitGid, 
                text: item.transportHandlingUnitGid, 
                _id: item.obShipUnitGid
            }
        })

    } catch (error) {
        console.log("-getAllIsoCode-", error);
    }
    
    return Object.values(tempKeyObj)

    /* From API: do not change here */
    // let filterQuery = {};

    // filterQuery.$or = [];
    // if (search && search !== "") {
    //     const searchRegex = new RegExp(`.*${search}.*`, "i");
    //     filterQuery.$or.push({ text: { $regex: searchRegex } });
    //     filterQuery.$or.push({ code: { $regex: searchRegex } });
    // }
    // if (filterQuery.$or.length === 0) {
    //     return await IsoCodeModel.find({}).limit(limit);
    // }
    // return await IsoCodeModel.find(filterQuery).limit(limit);

}

module.exports = getAllIsoCode