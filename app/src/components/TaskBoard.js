import React, { useEffect, useState, useCallback } from "react";

import * as dbRequest from "../dbRequest";

import Task from "./Task.js";
import TaskAddForm from "./TaskAddForm";

function TaskBoard({
  isAuthenticated,
  gcal,
  timedownAccount,
  setDetails,
  setAction,
  setTasksList,
  tasksList,
}) {
  async function getTasksInfo() {
    let data = JSON.stringify(await dbRequest.getTasks(timedownAccount.id));
    let tasks = JSON.parse(data);

    setTasksList(tasks);
  }

  useEffect(() => {
    getTasksInfo();
  }, []);

  return (
    <div className="taskBoard">
      <h2>Your Tasks:</h2>
      <button onClick={setAction("addTask")}>Add New Task</button>
      {tasksList.map((task, index) => {
        return <Task key={index} {...{ task, setDetails, setAction }} />;
      })}
    </div>
  );
}

export default TaskBoard;
