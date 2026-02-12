const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const sendgridService = require('../services'); // Local services folder
const pick = require('../../../utilities/pick');

const getDailySurpassedEmails = catchAsync(async (req, res) => {
  const { days } = await pick(req.query, ['days']);
  
  const daysToFetch = days ? parseInt(days) : 10;

  const result = await sendgridService.getDailySurpassedEmails(daysToFetch);

  if (result.status) {
    sendResponse(res, httpStatus.OK, result.data, null);
  } else {
    sendResponse(
      res,
      result.code === 404 ? httpStatus.NOT_FOUND
        : result.code === 500 ? httpStatus.INTERNAL_SERVER_ERROR
        : httpStatus.BAD_REQUEST,
      null,
      result.msg
    );
  }
});

module.exports = getDailySurpassedEmails;
