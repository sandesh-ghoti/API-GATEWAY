const { UserRepository } = require("../repositories");
const userRepository = new UserRepository();
const { ErrorResponse } = require("../utils/common");
const { validateAccessToken } = require("../utils/common/auth");
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
async function authentication(req, res, next) {
  try {
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      throw new AppError(
        ["authorization header is required"],
        StatusCodes.BAD_REQUEST
      );
    }
    let accessToken = req.headers.authentication.split(" ")[1];
    //if accesstoken valid
    let id = validateAccessToken(accessToken);
    // validated user
    let user = await userRepository.id(id);
    if (!user) throw new AppError(["user not found"], StatusCodes.BAD_REQUEST);
    req.id = id;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error.name == "JsonWebTokenError") {
      throw new AppError("Invalid JWT token", StatusCodes.BAD_REQUEST);
    }
    if (error.name == "TokenExpiredError") {
      throw new AppError("JWT token expired", StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Something went wrong",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
module.exports = {
  validateUserSignInReq,
  validateUserSignUpReq,
  authentication,
};
