const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING id, username;
    `,
      [username, password]
    );

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user. Please try again later.");
  }
}

async function getUser({ username, password }) {}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE id = $1; 
    `,
      [userId]
    );
    if (!user) {
      return null;
    } else {
      delete user.password;
      return user;
    }
  } catch (error) {
    console.error("Error finding user:", error);
    throw new Error("Failed to find user. Please try again later.");
  }
}

async function getUserByUsername(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
      `,
      [userName]
    );

    return user;
  } catch (error) {
    console.error("Error finding user:", error);
    throw new Error("Failed to find user. Please try again later.");
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
