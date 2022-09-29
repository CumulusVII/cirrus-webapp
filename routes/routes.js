const express = require("express");
const router = express.Router();

// ROUTES
router.get("/", (req, res) => {
  res.json({
    message:"server responds with 200 OK if it is healthy"
  });
});
module.exports = router;