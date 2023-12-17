const { UserRepository } = require("../repositories");
const userRepository = new UserRepository();
const AppError = require("../utils/errors/appError");
const { StatusCodes } = require("http-status-codes");
const {
  hashPassword,
  comparePassword,
  validPassword,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/common/auth");
async function signup(data) {
  try {
    //if emailid not exists then create
    if (await userRepository.getUserByEmail(data.email)) {
      throw new AppError(["user already exits"], StatusCodes.BAD_REQUEST);
    }
    //validate password
    if (!validPassword(data.password)) {
      throw new AppError(
        ["password not fullfilling requirement"],
        StatusCodes.BAD_REQUEST
      );
    }
    //hash password
    data.password = await hashPassword(data.password);
    const user = await userRepository.create(data);
    user.password = "*******";
    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else if (error.name == "TypeError") {
      throw new AppError(
        ["unable to signup"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } else if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((e) => {
        explanation.push(e.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    } else if (error.name == "SequelizeForeignKeyConstraintError") {
      console.log(error);
      throw new AppError(
        [
          "ForeignKey Constraint Error please provide valid ${add here which foregin key has error}",
        ],
        StatusCodes.BAD_REQUEST
      );
    }
    throw new AppError(["unable to signup"], StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
async function signin(data) {
  try {
    //if emailid not exists then create
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(["user not found"], StatusCodes.NOT_FOUND);
    }
    //validate password
    let result = await comparePassword(data.password, user.password);
    console.log(result);
    if (!result) {
      throw new AppError(["password not match"], StatusCodes.BAD_REQUEST);
    }
    user.password = data.password;
    let accessToken = generateAccessToken({ id: user.id });
    let refreshToken = generateRefreshToken({ id: user.id });
    return { user, accessToken, refreshToken };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else if (error.name == "TypeError") {
      throw new AppError(
        ["unable to sign in"],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    } else if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((e) => {
        explanation.push(e.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    } else if (error.name == "SequelizeForeignKeyConstraintError") {
      console.log(error);
      throw new AppError(
        [
          "ForeignKey Constraint Error please provide valid ${add here which foregin key has error}",
        ],
        StatusCodes.BAD_REQUEST
      );
    }
    throw new AppError(
      ["unable to sign in"],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = { signup, signin };