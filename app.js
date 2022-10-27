require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// CUSTOM ROUTES
const healthzRoute = require("./src/routes/healthz");
const userRoute = require("./src/routes/user");
const imageRoute = require("./src/routes/image");
const db = require("./src/models");
const path = require('path')

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//MIDDLEWARES
app.use("/", healthzRoute);
app.use("/", userRoute);
app.use("/", imageRoute);

// PORT
const PORT = 3000;
db.sequelize.sync();
// STARTING A SERVER
app.listen(PORT, () => console.log(`app listening on port ${PORT}`));

module.exports = app;
