/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const { getAllUsers, createUser, getUserByUsername } = require("../db/users");
const { getPublicRoutinesByUser } = require("../db/routines");
const bcrypt = require("bcrypt");

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
      const jwtToken = jwt.sign(user, JWT_SECRET);
      res.send({ user: user, token: jwtToken, message: "you're logged in!" });
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

//  OG POST /api/users/register

// // POST /api/users/login
// router.post("/login", async (req, res, next) => {
//   const { username, password } = req.body;
//   console.log(req.body);

//   // request must have both
//   if (!username || !password) {
//     next({
//       name: "MissingCredentialsError",
//       message: "Please supply both a username and password",
//     });
//   }

//   try {
//     const user = await getUserByUsername(username);

//     if (user && user.password == password) {
//       // create token & return to user
//       const token = jwt.sign(
//         { id: user.id, username: user.username },
//         process.env.JWT_SECRET
//       );

//       token;

//       const recoveredData = jwt.verify(token, process.env.JWT_SECRET);

//       recoveredData;
//       res.send({ message: "you're logged in!", token });
//     } else {
//       next({
//         name: "IncorrectCredentialsError",
//         message: "Username or password is incorrect",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
