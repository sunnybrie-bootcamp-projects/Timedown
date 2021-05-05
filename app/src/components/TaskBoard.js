import React, { useEffect, useState, useCallback } from "react";

import * as dbRequest from "../dbRequest";

function TaskBoard() {
  const [tasksList, setTasksList] = useState("");

  async function getTasksInfo() {
    let data = JSON.stringify(await dbRequest.getTasks());

    setTasksList(data);
  }

  useEffect(() => {
    getTasksInfo();
  }, []);

  return (
    <div className="taskBoard">
      <h2>Your Tasks:</h2>
      <p>{tasksList}</p>
    </div>
  );
}

export default TaskBoard;
