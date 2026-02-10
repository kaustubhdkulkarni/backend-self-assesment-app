const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

const getDocumentByRequestedId = catchAsync(async (req, res) => {
  const {limit, page,requesteduserid,status} = pick(req.query, ["limit", "page","requesteduserid","status"])
  const data = await service.getDocumentByRequestedId({limit, page,status, userData:req.user})
  if(data){
      sendResponse(res, httpStatus.OK, data, null);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found", {}, "")
  }
});

module.exports = getDocumentByRequestedId;
