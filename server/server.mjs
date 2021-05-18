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
tasks.post("/delete", async (request, response) => {
  const { id } = request.body;
  const deletedTask = await db.deleteTask(id);
  response.status(201).json(deletedTask);
});

app.use("/api/tasks", tasks);

//User Routes
const users = express.Router();

users.use(express.json());
users.post("/", async (request, response) => {
  const { email } = request.body;
  const user = await db.getUser(email);

  response.status(201).json(user);
});

app.use("/api/users", users);

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
