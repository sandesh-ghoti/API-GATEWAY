const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
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
    const response = await UserService.signin({
      emailId: req.body.emailId,
      password: req.body.password,
    });
    SuccessResponse.data = response;
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
module.exports = { signup, signin, signout };
