require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// CUSTOM ROUTES
const healthRoute = require("./src/routes/healthz");
const userRoute = require("./src/routes/user");
const docRoute = require("./src/routes/document");
const db = require("./src/models");
const path = require('path')

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//MIDDLEWARES
app.use("/", healthRoute);
app.use("/", userRoute);
app.use("/", docRoute);

// PORT
const PORT = process.env.PORT || 3000;
db.sequelize.sync();
// STARTING A SERVER
app.listen(PORT, () => console.log(`app listening on port ${PORT}`));

module.exports = app;
