const express = require("express");
const router = express.Router();
// const logger = require("../config/logger");
// const dbConfig = require("../config/config");
// const SDC = require("statsd-client");
const { healthz } = require("../controllers/healthz");
// const sdc = new SDC({
//   host: dbConfig.METRICS_HOSTNAME,
//   port: dbConfig.METRICS_PORT,
// });


// ROUTES
router.get("/health", healthz);
router.get("/", healthz);

module.exports = router;