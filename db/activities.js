const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      INSERT INTO activities(name, description) 
      VALUES($1, $2) 
      ON CONFLICT (name) DO NOTHING 
      RETURNING *;
    `,
      [name, description]
    );

    return activity;
  } catch (error) {
    console.error("Error creating activity:", error);
    throw new Error("Failed to create activity. Please try again later.");
  }
}
// return the new activity

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows: activities } = await client.query(`
    SELECT *
    FROM activities;
    `);

    return activities;
  } catch (error) {
    console.log(error);
  }
}

async function getActivityById(activityId) {
  try {
    const {
      rows: [activities],
    } = await client.query(
      `SELECT *
    FROM activities
    WHERE id=$1
    `,
      [activityId]
    );

    return activities;
  } catch (error) {
    console.log(error);
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activities],
    } = await client.query(
      `SELECT *
    FROM activities
    WHERE name=$1
    `,
      [name]
    );

    return activities;
  } catch (error) {
    console.log(error);
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(",");
  try {
    if (setString.length > 0) {
      const { rows } = await client.query(
        `UPDATE activities
        SET ${setString}
        WHERE id = ${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
      return rows[0];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
