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
    <table
      className="taskBoard"
      style={{
        display: tab === "taskboard" ? "inline-table" : "none",
      }}
    >
      <caption>
        <h2>Your Tasks</h2>
      </caption>
      <thead>
        <tr className="taskBoardActions">
          <td>
            <button onClick={() => taskAction("addTask")}>Add New Task</button>
          </td>
        </tr>
        <tr>
          <th id="taskDueDate" scope="col">
            Due
          </th>
          <th id="taskSummary" scope="col">
            Summary
          </th>
          <th id="taskProgress" scope="col">
            Progress
          </th>
          <th id="taskOptions" scope="col">
            Options
          </th>
        </tr>
      </thead>
      <tbody>
        {tasksList.map((task, index) => {
          return <Task key={index} {...{ task, setDetails, setAction }} />;
        })}
      </tbody>
    </table>
  );
}

export default TaskBoard;
