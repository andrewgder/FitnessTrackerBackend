const express = require("express");
const router = express.Router();
const {
  getAllPublicRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivityById,
} = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
// GET /api/routines
router.get("/", async (req, res) => {
  const allRoutines = await getAllPublicRoutines();
  res.send(allRoutines);
});

// POST /api/routines
router.post("/", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, JWT_SECRET);

    const { isPublic, name, goal } = req.body;
    const creatorId = verify.id;
    if (creatorId && isPublic && name && goal) {
      const newRoutine = await createRoutine({
        creatorId,
        isPublic,
        name,
        goal,
      });
      res.send(newRoutine);
    } else {
      res.send({ message: "Missing fields" });
    }
  } catch ({ name, message }) {
    res.send({
      error: "not logged in",
      name: "Need to be logged in",
      message: "You must be logged in to perform this action",
    });
  }
});

// PATCH /api/routines/:routineId

router.patch("/:routineId", async (req, res, next) => {
  const { routineId } = req.params;
  const creatorID = await getRoutineById(routineId);

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const verify = jwt.verify(token, JWT_SECRET);
    if (verify.id) {
      if (Object.keys(req.body).length === 0) {
        throw Error("No update fields");
      }
      console.log("creatorID", creatorID[0].creatorId, verify.id);
      if (creatorID[0].creatorId !== verify.id) {
        // res.send({
        //   error: "401 - Unauthorized",
        //   message: "User Mandy is not allowed to update Every day",
        //   name: "UnauthorizedError",
        // });
        // res.status(403).send({
        //   error: "Forbidden",
        //   message: "You do not have permission to access this resource.",
        // });
      }
      const updateFields = { id: routineId, ...req.body };
      const updatedRoutine = await updateRoutine(updateFields);
      res.send(updatedRoutine);
    }
  } catch ({ name, message }) {
    res.send({
      error: "Login",
      name: "login",
      message: "You must be logged in to perform this action",
    });
    next({ name, message: "You must be logged in to perform this action" });
  }
});

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
