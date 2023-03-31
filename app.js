require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./api");

// Setup your Middleware and API Router here

const cors = require("cors");

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
// app.listen(80, () => {
//   console.log("Server started on port 80");
// });
app.use("/api", apiRouter);

module.exports = app;
