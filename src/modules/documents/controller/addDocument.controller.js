const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
  const createdBy = req.user._id
  let assignTo = createdBy
  const { 
    domainName,
    shippingLineId,
    documentUrl,
    bookingNo,
    documentType,
    stageType,
    documentNo } = await pick(req.body,
     ['domainName', 'shippingLineId','documentUrl','documentType','stageType','documentNo', 'bookingNo']);

  const list = await service.addDocument({ domainName, shippingLineId,documentUrl,documentType,stageType,documentNo,createdBy,assignTo, bookingNo});
  sendResponse(res, httpStatus.OK, list, null);
});

module.exports = add;