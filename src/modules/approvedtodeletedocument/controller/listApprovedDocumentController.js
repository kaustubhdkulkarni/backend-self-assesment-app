const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const listApprovedDocumentController = catchAsync(async (req, res) => {
  const { limit, page, status } = await pick(req.query, ["limit", "page","status"]);
  const list = await service.listApprovedDocument({limit, page,status});
  sendResponse(res, httpStatus.OK, list, null);
});
module.exports = listApprovedDocumentController;
