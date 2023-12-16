const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  SALT_ROUND,
  REFRESH_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_JWT_EXPIRY,
  REFRESH_JWT_EXPIRY,
} = require("../../config/serverConfig");
const AppError = require("../errors/appError");
const { StatusCodes } = require("http-status-codes");
async function hashPassword(password) {
  return await bcrypt.hash(password, +SALT_ROUND);
}
async function comparePassword(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}

async function refreshAccessToken(refreshToken) {
  // if this is throwing error then we need to logout user
  if (!refreshToken) {
    throw new AppError(["refresh token not found"], StatusCodes.BAD_REQUEST);
  }
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_PRIVATE_KEY);
    const id = decoded.id;
    const accessToken = generateAccessToken({ id });
    return accessToken;
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
async function validateAccessToken(accessToken) {
  if (!accessToken) {
    throw new AppError(["access token not found"], StatusCodes.BAD_REQUEST);
  }
  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_PRIVATE_KEY);
    const id = decoded.id;
    return id;
  } catch (e) {
    throw new AppError([e.message], StatusCodes.BAD_REQUEST);
  }
}
//internal function
function generateAccessToken(data) {
  console.log("generating accessToken");
  return jwt.sign(data, ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: ACCESS_JWT_EXPIRY,
  });
}
function generateRefreshToken(data) {
  return jwt.sign(data, REFRESH_TOKEN_PRIVATE_KEY, {
    expiresIn: REFRESH_JWT_EXPIRY,
  });
}
function validPassword(password) {
  if (password.length < 5 || password.length > 50) {
    return false;
  }
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#])[0-9a-zA-Z@#]+$/;
  return pattern.test(password);
}
module.exports = {
  hashPassword,
  comparePassword,
  refreshAccessToken,
  validateAccessToken,
  generateAccessToken,
  generateRefreshToken,
  validPassword,
};
