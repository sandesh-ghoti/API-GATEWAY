const { UserRepository } = require("../repositories");
const { UserService } = require("../services");
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
    let accessToken = req.headers.authorization.split(" ")[1];
    //if accesstoken valid
    let id = await validateAccessToken(accessToken);
    // validated user
    let user = await userRepository.get(id);
    if (!user) throw new AppError(["user not found"], StatusCodes.BAD_REQUEST);
    req.body.user = user;
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ name: error.name, message: error.message });
  }
}
function validateAddRoleReq(req, res, next) {
  if (!req.userId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "userId" });
  }
  if (!req.roleId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "roleId" });
  }
  next();
}
async function isAdmin(req, res, next) {
  try {
    if (!req.body.user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found" });
    }
    const response = await UserService.isAdmin(req.body.user);
    if (!response) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User is not admin" });
    }
    next();
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
module.exports = {
  validateUserSignInReq,
  validateUserSignUpReq,
  authentication,
  validateAddRoleReq,
  isAdmin,
};
