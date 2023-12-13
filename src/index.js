const express = require("express");
const { serverConfig, Logger } = require("./config");
const app = express();
const apiRoutes = require("./routes");

app.use("/api", apiRoutes);
app.get("/", (req, res) => {
  return res.send("ok");
});
app.listen(serverConfig.PORT, () => {
  console.log(`listening on port ${serverConfig.PORT}`);
  Logger.info("successfully started server", "root", {});
});
