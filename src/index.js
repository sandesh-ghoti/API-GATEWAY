const express = require("express");
const { rateLimit } = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { serverConfig, Logger } = require("./config");
const app = express();
const apiRoutes = require("./routes");
const {
  FLIGHT_SERVICE_ADDRESS,
  BOOKING_SERVICE_ADDRESS,
} = require("./config/serverConfig");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 10 minutes
  limit: 2,
});
app.use(limiter);
app.use(
  "/flightService",
  createProxyMiddleware({
    target: FLIGHT_SERVICE_ADDRESS,
    changeOrigin: true,
    pathRewrite: { "^/flightService": "/" },
  })
);
app.use(
  "/bookingService",
  createProxyMiddleware({
    target: BOOKING_SERVICE_ADDRESS,
    changeOrigin: true,
    pathRewrite: { "^/bookingService": "/" },
  })
);
app.use("/api", apiRoutes);
app.get("/", (req, res) => {
  return res.send("ok");
});
app.listen(serverConfig.PORT, () => {
  console.log(`listening on port ${serverConfig.PORT}`);
  Logger.info("successfully started server", "root", {});
});
