const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const sendgridService = require('../services'); // Local services folder
const pick = require('../../../utilities/pick');

const getSuppressionData = catchAsync(async (req, res) => {
  const { days, date } = await pick(req.query, ['days', 'date']);
  
  // Parse days parameter
  const daysToFetch = days ? parseInt(days) : null;
  
  // Validate date format if provided
  if (date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        null,
        'Invalid date format. Please use YYYY-MM-DD format.'
      );
    }
  }

  const result = await sendgridService.getSuppressionData(daysToFetch, date);

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

module.exports = getSuppressionData;
