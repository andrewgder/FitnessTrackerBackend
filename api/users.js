/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const {
  getAllUsers,
  createUser,
  getUserByUsername,
  getUserById,
} = require("../db/users");
const {
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
} = require("../db/routines");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// POST /api/users/login

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.send({
      name: "MissingCredentialsError",
      message: "Please suppy both a username and password",
    });
  }
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    if (user && (await bcrypt.compare(password, hashedPassword))) {
      const jwtToken = jwt.sign({ id: user.id, username }, JWT_SECRET);
      jwtToken;
      const verifyJson = jwt.verify(jwtToken, JWT_SECRET);
      verifyJson;
      res.send({
        user: {
          id: user.id,
          username,
        },
        token: jwtToken,
        message: "you're logged in!",
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const _user = await getUserByUsername(username);
    if (_user) {
      res.send({
        error: "UserExistsError",
        message: "User " + username + " is already taken.",
        name: "UsernameExists",
      });
    } else if (password.length < 8) {
      res.send({
        error: "PasswordLengthError",
        message: "Password Too Short!",
        name: "Short Password",
      });
    } else {
      const user = await createUser({ username, password });

      if (user) {
        const jwtToken = jwt.sign(user, JWT_SECRET);
        const response = {
          message: "thank you for signing up",
          token: jwtToken,
          user: {
            id: user.id,
            username: user.username,
          },
        };
        res.send(response);
      }
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/me
router.get("/me", async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({
      error: "401 - Unauthorized",
      message: "You must be logged in to perform this action",
      name: "UnauthorizedError",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await getUserById(userId);

    res.send({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    next(error);
  }
});

// router.get("/me", async (req, res, next) => {
//   const { username } = req.params;
//   const authheader = req.headers.authorization;

//   const user = await getUserByUsername(username);
//   console.log();
//   try {
//     if (authheader) {
//         const verifyJson = jwt.verify(authheader, JWT_SECRET);
//         verifyJson;
//       res.send(verify);
//     } else {
//       res.status(401).send({
//         error: "401 - Unauthorized",
//         message: "You must be logged in to perform this action",
//         name: "UnauthorizedError",
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// GET /api/users/:username/routines

router.get("/:username/routines", async (req, res, next) => {
  let returnRoutines;
  const authHeader = req.headers.authorization;
  const { username } = req.params;
  try {
    const publicRoutines = await getPublicRoutinesByUser({ username });

    if (!authHeader) {
      returnRoutines = publicRoutines;
      res.send(returnRoutines);
    } else {
      const token = authHeader.split(" ")[1];
      const verify = jwt.verify(token, JWT_SECRET);
      if (verify.username !== username) {
        returnRoutines = publicRoutines;
        res.send(returnRoutines);
      } else {
        const userRoutines = await getAllRoutinesByUser({ username });
        returnRoutines = userRoutines;
        res.send(returnRoutines);
      }
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
