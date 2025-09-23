const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/db");
const { handleError } = require("./middleware");
const api = require("./api");
const upload = require("./upload");
const jobApi = require("./profilehandler");
const authenticateToken = require("./authmiddleware");

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

// Public route
app.post("/login", api.handleLogin);

// Protected routes
app.post("/profile/:email", upload.single("resume"), api.handleSaveProfile);
app.get("/profile/:email", api.handleGetProfile);
app.get("/download/:email", api.handleDownload);
app.post("/job/:email", upload.single("resume"), api.handleJobApplication);
app.get("/savedjob/:email", api.handleGetJobApplications);
app.delete("/deleteapp/:email", api.handleDeleteJobApplication);
app.post("/resume/:email", api.handleSaveOrEditResume);
app.get("/resume/:email", api.handleGetResumeData);

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
