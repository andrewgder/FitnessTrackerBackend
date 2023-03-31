const express = require("express");
const router = express.Router();
const database = require("../db");
const app = require("../app");

// GET /api/health

// router.get("/unknown", async (req, res, next) => {
//   res.send({
//     status: 404,
//     message: "404 error",
//   });
// });

router.get("/health", async (req, res, next) => {
  console.log("server is running on port 80, /health checking health");
  res.send({
    message: "made it to the api page",
  });
});

// ROUTER: /api/users
const usersRouter = require("./users");
router.use("/users", usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require("./activities");
router.use("/activities", activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require("./routines");
router.use("/routines", routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require("./routineActivities");
router.use("/routine_activities", routineActivitiesRouter);

//error handling
router.use((req, res) => {
  res.status(404).send({ message: "404 - Page not found" });
});

module.exports = router;
