import dotenv from "dotenv";
import pgp from "pg-promise";

const db = initDb();

function initDb() {
  let connection;

  if (process.env.DATABASE_URL === undefined) {
    dotenv.config({ path: "../.env" });
    connection = {
      user: "postgres",
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 5442,
    };
  } else {
    connection = {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };
  }

  return pgp()(connection);
}

//TASK QUERIES
export const getTasks = async (user) => {
  let userId = parseInt(user);
  const tasks = await db.any(`SELECT * FROM tasks WHERE "userId" = $1`, [
    userId,
  ]);
  return tasks;
};

export const addTask = async (
  userId,
  dueDate,
  estTimeHours,
  estTimeMinutes,
  summary,
  description,
) => {
  let estTime = { hours: estTimeHours, minutes: estTimeMinutes };
  estTime = estTime;

  console.debug({ estTime });

  let newTask = await db.any(
    `INSERT INTO tasks("userId", "dueDate", "estTime", "summary", "description")
VALUES($1, $2, $3, $4, $5)`,
    [userId, dueDate, estTime, summary, description],
  );

  return newTask;
};

export const deleteTask = async (id) => {
  let deletedTask = await db.any(
    `DELETE FROM tasks WHERE id = $1 RETURNING id, summary`,
    [id],
  );

  return deletedTask;
};

//USER QUERIES
// Prescott Murphy11:28 AM
// SELECT *
// FROM users
// JOIN settings
//   ON users."id" = settings."userId"
// WHERE users.email = 'mandychen.art@gmail.com';
// Prescott Murphy11:32 AM
// INSERT INTO ON DUPLICATE KEY IGNORE
export const getUser = async (email) => {
  try {
    const account = await db.any(
      `SELECT * 
FROM users
LEFT JOIN settings
  ON users."id" = settings."userId"
WHERE users.email = $1`,
      [email],
    );
    if (account.length <= 0) {
      throw {
        error:
          "There doesn't seem to be an account associated with your email. If this is your first time using this app, try registering instead.",
      };
    } else {
      return account[0];
    }
  } catch (err) {
    return err;
  }
};

export const addUser = async (email, name) => {
  try {
    const user = await db.any(
      `INSERT INTO users("email")
VALUES($1) RETURNING *`,
      [email],
    );

    const settings = await db.any(
      `INSERT INTO settings("userId", "awakeTime") VALUES($1, '{"start": '00:00', "end":'23:00'}') RETURNING *`,
      [user[0].id],
    );

    const task = await db.any(
      `INSERT INTO tasks("userId", "summary", "description", "estTime", "dueDate") VALUES($1, 'Hi $2!', 'Welcome to Timedown!', '{"hours": 0, "minutes": 0}', NOW())`,
      [user[0].id, name],
    );

    const newAccount = await db.any(
      `SELECT * 
FROM users
LEFT JOIN settings
  ON users."id" = settings."userId"
WHERE users."id" = $1`,
      [user[0].id],
    );

    return {
      success: true,
      message:
        "Your new account has been successfully registered! You may now try logging in with Google.",
      account: newAccount,
    };
  } catch (err) {
    return {
      success: false,
      message: "Account creation failed. Try refreshing and registering again.",
    };
  }
};

export const updateSettings = async (userId, awakeTime, eventBuffer) => {
  try {
    let query = `UPDATE settings SET "awakeTime" = '${JSON.stringify(
      awakeTime,
    )}', "eventBuffer" = '${JSON.stringify(
      eventBuffer,
    )}' WHERE "userId" = ${userId}`;
    const update = await db.any(query);

    return {
      success: true,
      message: "Your settings have been updated!",
    };
  } catch (err) {
    let query = `INSERT INTO settings("userId", "awakeTime", "eventBuffer") VALUES(${userId}, '${JSON.stringify(
      awakeTime,
    )} RETURNING *', '${JSON.stringify(eventBuffer)}'`;
    const update = await db.any(query);

    return {
      success: false,
      message:
        "Settings failed to be updated because they were not found. New settings were inserted.",
      settings: update,
    };
  }
};
