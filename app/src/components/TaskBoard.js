import React, { useEffect, useState, useCallback } from "react";

import * as ApiClient from "../ApiClient";

import Task from "./Task.js";
import TaskAddForm from "./TaskAddForm";

function TaskBoard({
  isAuthenticated,
  tab,
  gcal,
  user,
  setDetails,
  setAction,
  setTasksList,
  tasksList,
  getTasksInfo,
}) {
  function taskAction(action) {
    setAction(action);
  }

  useEffect(() => {
    getTasksInfo();
  }, []);

  return (
    <div
      className="taskBoard"
      style={{
        display: tab === "taskboard" ? "block" : "none",
      }}
    >
      <h2>Your Tasks:</h2>
      <button onClick={() => taskAction("addTask")}>Add New Task</button>
      {tasksList.map((task, index) => {
        return <Task key={index} {...{ task, setDetails, setAction }} />;
      })}
    </div>
  );
}

export default TaskBoard;
