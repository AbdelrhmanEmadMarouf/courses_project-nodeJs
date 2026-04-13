const STATUS_TEXT = {
    SUCCESS: "success",
    FAIL: "fail",
    ERROR: "error"
};

const HTTP_STATUS = {
// Success
OK: 200,
CREATED: 201,
ACCEPTED: 202,
NO_CONTENT: 204,


//  Client Errors
BAD_REQUEST: 400,
UNAUTHORIZED: 401,
FORBIDDEN: 403,
NOT_FOUND: 404,
METHOD_NOT_ALLOWED: 405,
CONFLICT: 409,
UNPROCESSABLE_ENTITY: 422,

//  Server Errors
INTERNAL_SERVER_ERROR: 500,
NOT_IMPLEMENTED: 501,
BAD_GATEWAY: 502,
SERVICE_UNAVAILABLE: 503
};

const MESSAGES = {
    COURSE_NOT_FOUND: "Course not found",
    ROUTE_NOT_FOUND : "Route not found",
    WRONG_EMAIL_FORMAT : "Wrong Email Format",
    WROG_OTP_VALIDATION : "Wrong OTP Validation",
    REQUIRED_EMAIL_AND_PASSWORD : "Email and Password are required",
    USER_NOT_FOUND : "The user is not exist",
    WRONG_PASSWORD : "Wrong Password",
    REQUIRED_TOKEN : "Required Token",
    INVALID_TOKEN  : "Invalid Token",
    INVALID_REFRESH_TOKEN  : "Invalid refresh token",
    YOU_ARE_NOT_ALLOW : "You are not allwoed to do this operation",
    REFRESH_TOKEN_NOT_FOUND : "Refresh Token Not Founded",
    WRONG_FILE_TYPE : "invalied uploaded file type"
};



module.exports = {
    STATUS_TEXT,
    HTTP_STATUS,
    MESSAGES
}