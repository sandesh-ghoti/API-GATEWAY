const express = require("express");
const router = express.Router();
const { UserController } = require("../../controllers");
const { ValidateUserMiddleware } = require("../../middlerwares");
// post user/signup
router.post(
  "/signup",
  ValidateUserMiddleware.validateUserSignUpReq,
  UserController.signup
);
// get user/ using emailId
router.get(
  "/signin",
  ValidateUserMiddleware.validateUserSignInReq,
  UserController.signin
);
//refresh access token
router.get("/refreshToken", UserController.refreshAccessTokenController);
// signout
router.get("/signout", UserController.signout);
//get user/all

//patch user/ using emailId

//delete user/:id
module.exports = router;
