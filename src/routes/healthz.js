const express = require("express");
const router = express.Router();



// ROUTES
router.get("/healthz", (req, res) => {
  res.send("server responds with 200 OK if it is healthy");
});


module.exports = router;