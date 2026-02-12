const sendResponse = (res, status, data, err = null) => {
    const success = status > 199 && status < 299;
    const responseData = err ? err : data;

    res.status(status)
    .set("Content-Type", "application/json") // ✅ Ensure JSON response
    .json({
        code: status,
        status: success,
        data: responseData
    });
};

module.exports = sendResponse;
