const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deleteDocumentByMail = catchAsync(async (req, res) => {
    const loggedInUser = req.user.id
    const { domainName } = await pick(req.query, ["domainName"]);
    const { id } = pick(req.params, ["id"])

    const result = await service.deleteDocumentByMail({ id,loggedInUser },domainName)
    if ( result === "deleteReqAlredyExist") sendResponse(res, httpStatus.BAD_REQUEST, "Request to Delete Document Already Submitted!", null)
    else if (result) sendResponse(res, httpStatus.OK, result, null)
    else sendResponse(res, httpStatus.BAD_REQUEST, result)
})

module.exports = deleteDocumentByMail