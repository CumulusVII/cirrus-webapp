const express = require("express");
const router = express.Router();
const {
  fetchUserData,
  createUser,
  updateUser,
  findAll,
} = require("../controllers/users");
const auth = require("../middlewares/auth");
// ROUTES
// router.get("/v1/account/all", findAll);
router.post("/v1/account/", createUser);
router.get("/v1/account/:id", auth, fetchUserData);
router.put("/v1/account/:id", auth, updateUser);

module.exports = router;
