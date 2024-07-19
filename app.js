const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes");
const app = express();


app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, OPTIONS, PUT, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-PINGOTHER, Origin, X-Requested-With, Content-Type, Accept, x-access-token"
  );
  next();
});



app.use("/api/v1", routes);

/*
eslint-disable
*/
app.use((err, req, res, next) => {
  process.stderr.write(err.stack);
  res.status(500).send({
    message: "Something went wrong. Internal server error",
  });
});

module.exports = app; // Ensure this line is present
