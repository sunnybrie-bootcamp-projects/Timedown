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

export const addTask = async (name) =>
  (
    await db.any("INSERT INTO tasks(name) VALUES($1) RETURNING id, name", [
      name,
    ])
  )[0];

export const getUser = async (email) => {
  let user = await db.any("SELECT * FROM users WHERE email = $1", [email]);

  return user[0];
};
