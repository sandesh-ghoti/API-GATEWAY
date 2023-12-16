const dotenv = require("dotenv");
dotenv.config("../.env");
module.exports = {
  PORT: process.env.PORT,
  FLIGHT_SERVICE_ADDRESS: process.env.FLIGHT_SERVICE_ADDRESS,
  BOOKING_SERVICE_ADDRESS: process.env.BOOKING_SERVICE_ADDRESS,
  SALT_ROUND: process.env.SALT_ROUND,
  ACCESS_TOKEN_PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PRIVATE_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_JWT_EXPIRY: process.env.REFRESH_JWT_EXPIRY,
  ACCESS_JWT_EXPIRY: process.env.ACCESS_JWT_EXPIRY,
};
