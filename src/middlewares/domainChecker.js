const httpStatus = require('http-status');
const sendResponse = require('../utilities/responseHandler');

const allowedDomains = [
    process.env.REMOTE_BASE_URL,  // User domain
    process.env.REMOTE_ADMIN_URL,    // Admin domain
	"https://storage-bucket.wadiaa.com",
	"http://localhost:3000",
	"http://localhost:5173"
].filter(Boolean); // Removes any undefined values

const domainCheckerMiddleware = (req, res, next) => {
	const origin = req.get('Origin');
	const referer = req.get('Referer');

	if (origin && origin !== undefined) {
		// Check Origin header
		try {
			if (!allowedDomains.includes(new URL(origin).origin)) {
				return sendResponse(res, httpStatus.FORBIDDEN, null, 'Forbidden: Invalid Origin');
			}
		} catch (error) {
			return sendResponse(res, httpStatus.FORBIDDEN, null, 'Forbidden: Invalid Origin');
		}
	} else if (referer && referer !== undefined) {
		// Check Referer header
		try {
			const refererUrl = new URL(referer);
			if (!allowedDomains.includes(refererUrl.origin)) {
				return sendResponse(res, httpStatus.FORBIDDEN, null, 'Forbidden: Invalid Referer');
			}
		} catch (error) {
			return sendResponse(res, httpStatus.FORBIDDEN, null, 'Forbidden: Invalid Referer');
		}
	} 
	// else {
	// 	// If neither Origin nor Referer header is present
	// 	return sendResponse(res, httpStatus.FORBIDDEN, null, 'Forbidden: Missing Origin/Referer');
	// }

	next();
};

module.exports = {
	domainCheckerMiddleware,
};
