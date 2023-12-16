const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const { InfoController } = require("../../controllers");
router.use("/user", userRoutes);
router.get("/info", InfoController.info);
module.exports = router;
