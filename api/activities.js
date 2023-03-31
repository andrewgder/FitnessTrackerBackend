const express = require("express");
const router = express.Router();
const {
  createActivity,
  updateActivity,
  getAllActivities,
  getPublicRoutinesByActivity,
  getActivityByName,
} = require("../db");

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    if (activities) {
      res.send(activities);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
