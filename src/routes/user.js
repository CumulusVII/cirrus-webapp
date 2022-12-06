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
router.post("/v2/account/", createUser);
router.get("/v2/account/:id", authorizeToken, fetchUserData);
router.put("/v2/account/:id", authorizeToken, updateUser);
router.get("/v2/verifyUserEmail",verifyUser)

module.exports = router;
