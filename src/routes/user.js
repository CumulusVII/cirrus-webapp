const express = require("express");
const logger = require("../config/logger");
const router = express.Router();
const {
  fetchUserData,
  createUser,
  updateUser,
  verifyUser,

} = require("../controllers/users");
const db = require("../models/index");
const User = db.users
const authorizeToken = require("../middlewares/auth")(User,logger);
// ROUTES
router.post("/v1/account/", createUser);
router.get("/v1/account/:id", authorizeToken, fetchUserData);
router.put("/v1/account/:id", authorizeToken, updateUser);
router.get("/v1/verifyUserEmail",verifyUser)

module.exports = router;
