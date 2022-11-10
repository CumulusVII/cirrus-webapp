const appRoot = require("app-root-path");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp,printf } = format;

const myFormat = printf(({ message, timestamp, ...data }) => {
  return `${timestamp}  ${message} ${data ? JSON.stringify(data):''}`;
});

const logger = new createLogger({
  format: combine(
    
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: `${appRoot}/logs/webapp.log` }),
    new transports.Console(),
  ],
 
});

module.exports = logger;
