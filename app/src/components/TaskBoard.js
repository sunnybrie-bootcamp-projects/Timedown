import React, { useEffect, useState, useCallback } from "react";

import * as dbRequest from "../dbRequest";

import Task from "./Task.js";
import TaskAddForm from "./TaskAddForm";

function TaskBoard({ isAuthenticated, gcal, timedownAccount, setTaskInFocus }) {
  const [tasksList, setTasksList] = useState([]);

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
      {tasksList.map((task, index) => {
        return <Task key={index} {...{ task, setTaskInFocus }} />;
      })}
      <TaskAddForm
        setTasksList={(e) => setTasksList(e)}
        {...{ timedownAccount }}
      />
    </div>
  );
}

export default TaskBoard;
