const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const sendgridService = require('../services'); // Local services folder
const pick = require('../../../utilities/pick');

const getFailedEmails = catchAsync(async (req, res) => {
  const { days, status } = await pick(req.query, ['days', 'status']);
  
  const daysToFetch = days ? parseInt(days) : 1;
  const filterStatus = status || 'all';

  const result = await sendgridService.getFailedEmails(daysToFetch, filterStatus);

  if (result.status) {
    sendResponse(res, httpStatus.OK, result.data, null);
  } else {
    sendResponse(
      res,
      result.code === 404 ? httpStatus.NOT_FOUND
        : result.code === 403 ? httpStatus.FORBIDDEN
        : result.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
        : httpStatus.BAD_REQUEST,
      null,
      result.msg
    );
  }
});

module.exports = getFailedEmails;
