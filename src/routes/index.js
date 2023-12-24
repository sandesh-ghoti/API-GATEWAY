const express = require("express");
const router = express.Router();
const v1Routes = require("./v1");
const { info } = require("../controllers/infoController");
router.use("/v1", v1Routes);
router.use("/info", info);
module.exports = router;
