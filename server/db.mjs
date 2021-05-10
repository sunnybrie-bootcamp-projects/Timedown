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

export const getTasks = async (user) => {
  let userId = parseInt(user);
  const tasks = await db.any(`SELECT * FROM tasks WHERE "userId" = $1`, [
    userId,
  ]);
  console.log({ tasks }); //TEST
  return tasks;
};

export const addTask = async (
  userId,
  dueDate,
  estTime,
  summary,
  description,
) => {
  let newTask = await db.any(
    `INSERT INTO tasks("userId", "dueDate", "estTime", "summary", "description")
VALUES($1, $2, $3, $4, $5) RETURNING id, summary`,
    [userId, dueDate, estTime, summary, description],
  );

  console.log({ newTask });
  return newTask;
};

export const getUser = async (email) => {
  const user = await db.any("SELECT * FROM users WHERE email = $1", [email]);
  if (user.length < 1) {
    user = await db.any(
      `INSERT INTO users("email")
VALUES($1) RETURNING *`,
      [email],
    );
  }

  return user[0];
};
