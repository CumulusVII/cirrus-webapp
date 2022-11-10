require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../models/index");
const logger = require("../config/logger");
const dbConfig = require("../config/config");
const SDC = require("statsd-client");
const sdc = new SDC({
  host: dbConfig.METRICS_HOSTNAME,
  port: dbConfig.METRICS_PORT,
});
const User = db.users;

// create user in database
exports.createUser = (req, res) => {
  sdc.increment("Creating User");
  const { protocol, method, hostname, originalUrl } = req;
  const headers = { ...req.headers };
  const data = { protocol, method, hostname, originalUrl, headers };
  logger.info(`Request for ${method} ${protocol}://${hostname}${originalUrl}`, {
    data,
  });
  if (!req.body.first_name) {
    logger.warn("Invalid request body for user object");
    res.status(400).send();
    return;
  } else if (!req.body.last_name) {
    logger.warn("Invalid request body for user object");
    res.status(400).send();
    return;
  } else if (!req.body.username) {
    logger.warn("Invalid request body for user object");
    res.status(400).send();
    return;
  } else if (!req.body.password) {
    logger.warn("Invalid request body for user object");
    res.status(400).send();
    return;
  }

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({
        error: err,
        message: "Some error occurred while creating the user",
      });
    } else {
      const userObject = {
        id: req.body.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hash,
      };
      logger.info("Creating new user " + req.body.username);
      User.create(userObject)
        .then((data) => {
          console.log(data.id);
          const dataNew = {
            id: data.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            account_created: data.account_created,
            account_updated: data.account_updated,
          };

          res.status(201).send({ dataNew });
        })
        .catch((err) => {
          res.status(400).send();
        });
    }
  });
  let endTime = new Date();
};

// update user
exports.updateUser = (req, res) => {
  sdc.increment("Updating User");
  const { protocol, method, hostname, originalUrl } = req;
  const headers = { ...req.headers };
  const data = { protocol, method, hostname, originalUrl, headers };
  logger.info(`Request for ${method} ${protocol}://${hostname}${originalUrl}`, {
    data,
  });

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      logger.error("Invalid request body for user object");
      res.status(400).json({
        message: "Choose a user ID to update",
      });
    } else if (req.params.id == null) {
      logger.error("Invalid request body for user object");
      res.status(400).json({
        message: "Choose a user ID to update",
      });
    } else {
      const id = req.params.id;

      if (req.body.username) {
        logger.error("Invalid request body for user object");
        res.status(400).send({
          message: "Username cannot be updated",
        });
        return;
      }
      if (req.body.account_created) {
        logger.error("Invalid request body for user object");
        res.status(400).send({
          message: "account_created cannot be updated",
        });
        return;
      }
      if (req.body.account_updated) {
        logger.error("Invalid request body for user object");
        res.status(400).send({
          message: "account_updated cannot be updated",
        });
        return;
      }
      const userUpdate = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hash,
      };
      console.log("UserData", userUpdate);
      User.findByIdAndUpdate(userUpdate, {
        where: { id: result.id },
      })
        .then((num) => {
          if (num == 1) {
            res.status(200).send({
              message: "User was updated successfully.",
            });
          } else {
            res.status(400).send({
              message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
            });
          }
        })
        .catch((err) => {
          logger.warn("Internal Server Error");
          res.status(500).send({
            message: "Error updating User with id=" + id,
          });
        });
    }
  });
  let endTime = new Date();
};

// finding user information from database
exports.fetchUserData = async (req, res) => {
  sdc.increment("Finding Data");
  const { protocol, method, hostname, originalUrl } = req;
  const headers = { ...req.headers };
  const data = { protocol, method, hostname, originalUrl, headers };
  logger.info(`Request for ${method} ${protocol}://${hostname}${originalUrl}`, {
    data,
  });
  let result = await User.findOne({
    where: {
      username: global.username,
    },
  });
  res.status(200).send({
    id: result.id,
    first_name: result.first_name,
    last_name: result.last_name,
    username: result.username,
    account_created: result.account_created,
    account_updated: result.account_updated,
  });
};
