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
  getTasksInfo,
}) {
  function taskAction(action) {
    setAction(action);
  }

  useEffect(() => {
    getTasksInfo();
  }, []);

  return (
    <div className="taskBoard">
      <h2>Your Tasks:</h2>
      <button onClick={() => taskAction("addTask")}>Add New Task</button>
      {tasksList.map((task, index) => {
        return <Task key={index} {...{ task, setDetails, setAction }} />;
      })}
    </div>
  );
}

export default TaskBoard;
