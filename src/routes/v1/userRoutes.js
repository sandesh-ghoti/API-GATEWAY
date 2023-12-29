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
//get user/addRoleToUser
router.get(
  "/addRoleToUser",
  ValidateUserMiddleware.authentication,
  ValidateUserMiddleware.isAdmin,
  UserController.addRoleToUser
);
router.get(
  "/getAllUser",
  UserController.getAllUser
);
router.get(
  "/getAllRoles",
  UserController.getAllRoles
);
//patch user/ using emailId

//delete user/:id
module.exports = router;
