const express = require("express");
const router = express.Router();
const {
  createActivity,
  updateActivity,
  getAllActivities,
  getPublicRoutinesByActivity,
  getActivityByName,
  getActivityById,
} = require("../db");

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  try {
    const id = req.params.activityId;
    const activity = { id: id };
    const routines = await getPublicRoutinesByActivity(activity);
    if (!routines) {
      res.send({
        message: `Activity ${id} not found`,
        name: "ActivityDoesNotExistError",
        error: "Activity does not exist",
      });
    }
    res.send(routines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

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
router.post("/", async (req, res, next) => {
  var authheader = req.headers.authorization;
  console.log(authheader);
  const { name, description } = req.body;
  const activityData = { name, description };
  try {
    const activityName = await getActivityByName(name);
    const activity = await createActivity(activityData);
    if (activityName) {
      res.send({
        error: "Error",
        name: "ErrorGettingActivities",
        message: "An activity with name Push Ups already exists",
      });
    } else {
      const activityObj = {
        description: description,
        name: name,
      };
      res.send(activityObj);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId

router.patch("/:activityId", async (req, res, next) => {
  console.log(req.body);

  const { activityId } = req.params;
  console.log(activityId);

  const activityExists = await getActivityById(activityId);
  console.log(activityExists);
  if (!activityExists) {
    res.send({
      error: "Acitivty not found",
      name: "Activity not found",
      message: "Activity 10000 not found",
    });
  }

  const { name, description } = req.body;
  const updateFields = {};
  if (name) {
    updateFields.name = name;
  }
  if (description) {
    updateFields.description = description;
  }
  try {
    if (name) {
      const updatedActivity = await updateActivity({
        id: activityId,
        name: updateFields.name,
        description: updateFields.description,
      });

      res.send(updatedActivity);
    } else {
      next({
        error: "Activty not found",
        name: "Activity not found",
        message: "Activity 10000 not found",
      });
    }
  } catch (error) {
    res.send({
      error: "Duplicate",
      name: "Activity not found",
      message: `An activity with name ${name} already exists`,
    });
  }
});

module.exports = router;
