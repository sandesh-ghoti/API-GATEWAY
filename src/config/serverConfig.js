const dotenv = require("dotenv");
dotenv.config("../.env");
module.exports = {
  PORT: process.env.PORT,
};
