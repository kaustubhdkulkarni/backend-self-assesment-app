const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const list = catchAsync(async (req, res) => {
  const { collectionName, search, limit, documentNo, domainName } = await pick(req.query, ["collectionName","search", "limit", "documentNo", "domainName"]); 
  const list = await service.listPortMasterControllerForCollectionName({collectionName, search, limit, documentNo, domainName});
  sendResponse(res, httpStatus.OK, list, null);
});
module.exports = list;
