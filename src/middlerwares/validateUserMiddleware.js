const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/appError");
const { StatusCodes } = require("http-status-codes");
async function validateUserSignInReq(req, res, next) {
  if (!req.body.emailId || !req.body.password) {
    ErrorResponse.message = "Something went wrong while signin user";
    ErrorResponse.error = new AppError(
      [
        `${!req.body.emailId ? "emailId " : ""}${
          !req.body.password ? "password " : " "
        }not found in the oncoming request in the correct form`,
      ],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}
async function validateUserSignUpReq(req, res, next) {
  if (!req.body.emailId || !req.body.password) {
    ErrorResponse.message = "Something went wrong while signup the user";
    ErrorResponse.error = new AppError(
      [
        `${!req.body.emailId ? "emailId " : ""}${
          !req.body.password ? "password " : " "
        }not found in the oncoming request in the correct form`,
      ],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}
module.exports = { validateUserSignInReq, validateUserSignUpReq };
