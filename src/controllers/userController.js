const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const { refreshAccessToken } = require("../utils/common/auth");
async function signup(req, res) {
  try {
    const response = await UserService.signup({
      email: req.body.emailId,
      password: req.body.password,
    });
    SuccessResponse.data = response;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function signin(req, res) {
  try {
    const { user, accessToken, refreshToken } = await UserService.signin({
      email: req.body.emailId,
      password: req.body.password,
    });
    SuccessResponse.data = user;
    SuccessResponse.accessToken = accessToken;
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function signout(req, res) {
  try {
    res.clearCookie("jwt", { httpOnly: true, secure: true });
    SuccessResponse.data = "logout successfully";
    return res.status(StatusCodes.OK).send(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    ErrorResponse.message = error.name;
    return res.status(StatusCodes.NOT_MODIFIED).send(ErrorResponse);
  }
}
async function refreshAccessTokenController(req, res) {
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
    if (!req.cookies.jwt) {
      throw new AppError(
        ["refresh absent in cookies"],
        StatusCodes.BAD_REQUEST
      );
    }
    let acessToken = refreshAccessToken(req.cookies.jwt);
    SuccessResponse.data = acessToken;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res
      .status(
        error.statusCode ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR
      )
      .json(ErrorResponse);
  }
}
module.exports = { signup, signin, signout, refreshAccessTokenController };
