const logger = require("../config/logger");
const dbConfig = require("../config/config");
const SDC = require("statsd-client");
const sdc = new SDC({
    host: dbConfig.METRICS_HOSTNAME,
    port: dbConfig.METRICS_PORT,
  });


exports.healthz = (req, res) => {
    sdc.increment("endpoint.health");
    const {protocol,method,hostname,originalUrl} = req
    const headers = {...req.headers}
    const data = {protocol,method,hostname,originalUrl,headers}
    logger.info(`Request for ${method} ${protocol}://${hostname}${originalUrl}`, {data});
    res.send("server responds with 200 OK if it is healthy");
  }
