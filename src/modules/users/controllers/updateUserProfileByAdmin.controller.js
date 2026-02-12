const httpStatus = require("http-status");
const catchAsync = require("../../../utilities/catchAsync");
const sendResponse = require("../../../utilities/responseHandler");
const userService = require("../services");
const pick = require("../../../utilities/pick");

const updateUserProfileByAdmin = catchAsync(async (req, res) => {
    const { id: userId } = await pick(req?.params, ["id"]);
    
    const { 
        firstName,
        middleName,
        lastName,
        phone,
        dateOfBirth,
        gender,
        civilNumber,
        active,
        isAccountLocked,
        isMobileVerified,
        isEmailVerified,
        isKycVerified,
        isKybVerified
    } = await pick(req?.body, [
        "firstName",
        "middleName",
        "lastName",
        "phone",
        "dateOfBirth",
        "gender",
        "civilNumber",
        "active",
        "isAccountLocked",
        "isMobileVerified",
        "isEmailVerified",
        "isKycVerified",
        "isKybVerified"
    ]);
    
    const adminUser = req.user;

    const getResult = await userService.updateUserProfileByAdmin({
        userId,
        firstName,
        middleName,
        lastName,
        phone,
        dateOfBirth,
        gender,
        civilNumber,
        active,
        isAccountLocked,
        isMobileVerified,
        isEmailVerified,
        isKycVerified,
        isKybVerified,
        adminUser
    });

    if (getResult?.status) {
        sendResponse(res, httpStatus.OK, getResult?.data || getResult?.msg, null);
    } else {
        sendResponse(
            res,
            getResult?.code === 500
                ? httpStatus.INTERNAL_SERVER_ERROR
                : getResult?.code === 404
                ? httpStatus.NOT_FOUND
                : getResult?.code === 401
                ? httpStatus.UNAUTHORIZED
                : httpStatus.BAD_REQUEST,
            null,
            getResult?.msg
        );
    }
});

module.exports = updateUserProfileByAdmin;
