const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/db");
const { handleError } = require("./middleware");
const api = require("./api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "50mb", extended: true }));

// Connect to Database
db();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Register login route
app.post("/login", api.handleLogin);
app.post("/profile/:email", api.handleSaveProfile);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
