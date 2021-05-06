import React, { useEffect, useState, useCallback } from "react";

import * as dbRequest from "../dbRequest";

import Task from "./Task.js";

function TaskBoard({ isAuthenticated, gcal, timedownAccount }) {
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
      <p>
        {tasksList.map((task) => {
          return <Task {...{ task }} />;
        })}
      </p>
    </div>
  );
}

export default TaskBoard;
