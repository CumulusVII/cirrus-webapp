require('dotenv').config()
const bcrypt = require("bcrypt");
const db = require("../models/index");
const User = db.users;
const SDCClient = require("statsd-client");
const sdcclient = new SDCClient({ host: "localhost", port: 3000 });

// create user in database
exports.createUser = (req, res) => {
  // Validate request
  sdcclient.increment("Creating User");
  let startTime = new Date();

  if (!req.body.first_name) {
    res.status(400).send();
    return;
  } else if (!req.body.last_name) {
    res.status(400).send();
    return;
  } else if (!req.body.username) {
    res.status(400).send();
    return;
  } else if (!req.body.password) {
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
  sdcclient.timing("User creation time", endTime - startTime);
};

// get all user data
// exports.findAll = (req, res) => {
//   const id = req.query.id;
//   var condition = id ? { id: { [Op.iLike]: `%${id}%` } } : null;

//   User.findAll({ where: condition })
//     .then((data) => {
//       res.status(200).send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving Users.",
//       });
//     });
// };


// update user 
exports.updateUser = (req, res) => {
  sdcclient.increment("Updating User");
  let startTime = new Date();
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(400).json({
        message: "Choose a user ID to update",
      });
    } else if (req.params.id == null) {
      res.status(400).json({
        message: "Choose a user ID to update",
      });
    } else {
      const id = req.params.id;

      if (req.body.username) {
        res.status(400).send({
          message: "Username cannot be updated",
        });
        return;
      }
      if (req.body.account_created) {
        res.status(400).send({
          message: "account_created cannot be updated",
        });
        return;
      }
      if (req.body.account_updated) {
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
          res.status(500).send({
            message: "Error updating User with id=" + id,
          });
        });
    }
  });
  let endTime = new Date();
  sdcclient.timing("User Update time", endTime - startTime);
};

// finding user information from database
exports.fetchUserData = async (req, res) => {
  sdcclient.increment("Finding Data");
  let startTime = new Date();
  let result = await User.findOne({
    where: {
      username: global.username,
    },
  });
  let endTime = new Date();
  sdcclient.timing("Get User Data time", endTime - startTime);
  res.status(200).send({
    id: result.id,
    first_name: result.first_name,
    last_name: result.last_name,
    username: result.username,
    account_created: result.account_created,
    account_updated: result.account_updated,
  });
};

