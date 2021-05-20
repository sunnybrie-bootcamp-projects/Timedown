import express from "express";
import mime from "mime-types";

import * as db from "./db.mjs";

const app = express();
const port = process.env.PORT || 4000;

//Task routes
const tasks = express.Router();

tasks.get("/", async (request, response) => {
  const timedownUser = request.header("timedown-user");
  const tasks = await db.getTasks(timedownUser);
  response.json(tasks);
});

tasks.use(express.json());
tasks.post("/", async (request, response) => {
  const {
    userId,
    dueDate,
    estTimeHours,
    estTimeMinutes,
    summary,
    description,
  } = request.body;
  console.debug({ estTimeHours, estTimeMinutes });
  const task = await db.addTask(
    userId,
    dueDate,
    estTimeHours,
    estTimeMinutes,
    summary,
    description,
  );

  console.debug(task);
  response.status(201).json(task);
});
tasks.delete("/", async (request, response) => {
  const { id } = request.query;
  const deletedTask = await db.deleteTask(id);
  response.status(201).json(deletedTask);
});

app.use("/api/tasks", tasks);

//User Routes
const user = express.Router();

user.use(express.json());
user.get("/", async (request, response) => {
  const { email } = request.query;
  const user = await db.getUser(email);

  response.status(201).json(user);
});
user.post("/", async (request, response) => {
  const { email } = request.query;
  const message = await db.addUser(email);

  response.status(201).json(message);
});

app.use("/api/user", user);

process.env?.SERVE_REACT?.toLowerCase() === "true" &&
  app.use(
    express.static("/app", {
      maxAge: "1d",
      setHeaders: (res, path) =>
        ["application/json", "text/html"].includes(mime.lookup(path)) &&
        res.setHeader("Cache-Control", "public, max-age=0"),
    }),
  );

app.get("/api/ping", (request, response) =>
  response.json({ response: "pong" }),
);

app.listen(port, () => {
  console.info(`Example server listening at http://localhost:${port}`);
});
