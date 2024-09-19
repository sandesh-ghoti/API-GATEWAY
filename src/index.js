const express = require("express");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const {
  createProxyMiddleware,
  fixRequestBody,
} = require("http-proxy-middleware");
const { serverConfig, Logger } = require("./config");
const app = express();
const apiRoutes = require("./routes");
const {
  FLIGHT_SERVICE_ADDRESS,
  BOOKING_SERVICE_ADDRESS,
  NOTIFICATION_SERVICE_ADDRESS,
} = require("./config/serverConfig");
const { ValidateUserMiddleware } = require("./middlerwares");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 10,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(limiter);
app.use(
  "/flightService",
  ValidateUserMiddleware.authentication,
  createProxyMiddleware({
    target: FLIGHT_SERVICE_ADDRESS,
    changeOrigin: true,
    onProxyReq: fixRequestBody,
    pathRewrite: { ["^/flightService"]: "" },
  })
);
app.use(
  "/bookingService",
  ValidateUserMiddleware.authentication,
  createProxyMiddleware({
    target: BOOKING_SERVICE_ADDRESS,
    changeOrigin: true,
    onProxyReq: fixRequestBody,
    pathRewrite: { ["^/bookingService"]: "" },
  })
);
app.use(
  "/notificationService",
  ValidateUserMiddleware.authentication,
  createProxyMiddleware({
    target: NOTIFICATION_SERVICE_ADDRESS,
    changeOrigin: true,
    onProxyReq: fixRequestBody,
    pathRewrite: { ["^/notificationService"]: "" },
  })
);
app.use("/api", apiRoutes);
app.get("/", (req, res) => {
  return res.send("ok");
});
app.listen(serverConfig.PORT, async () => {
  console.log(`listening on port ${serverConfig.PORT}`);
  Logger.info("successfully started server", "root", {});
});
