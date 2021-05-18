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
  estTime = JSON.stringify(estTime);

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

  window.alert("Deleted Task: ", { deletedTask });
  return deletedTask;
};

//USER QUERIES
export const getUser = async (email) => {
  const account = await db.any(
    `SELECT * 
FROM users
JOIN settings
  ON users."id" = settings."userId"
WHERE users.email = $1`,
    [email],
  );
  if (account.length < 1) {
    user = await db.any(
      `INSERT INTO users("email")
VALUES($1) RETURNING *`,
      [email],
    );
    settings = await db.any(
      `INSERT INTO settings("userId") VALUES($1) RETURNING *`,
      [user[0].id],
    );

    account = await db.any(
      `SELECT * 
FROM users
JOIN settings
  ON users."id" = settings."userId"
WHERE users.email = $1`,
      [email],
    );
  }

  return account[0];
};
