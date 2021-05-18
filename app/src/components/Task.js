import React, { useEffect, useState, useCallback } from "react";

import * as ApiClient from "../ApiClient";

function Task({ task, setDetails, setAction }) {
  function seeDetails(action) {
    setDetails(task);
    setAction(action);
  }

  return (
    <div className="task">
      <span className="taskSummary">{task.summary}</span>

      <button
        value="deleteTask"
        className="deleteButton"
        onClick={(e) => seeDetails(e.target.value)}
      >
        Delete
      </button>
      <button
        value="readTask"
        className="detailsButton"
        onClick={(e) => seeDetails(e.target.value)}
      >
        {" "}
        See Details
      </button>
    </div>
  );
}

export default Task;
