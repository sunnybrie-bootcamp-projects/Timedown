import React, { useEffect, useState, useCallback } from "react";

import * as dbRequest from "../dbRequest";

function Task({ task, setTaskInFocus }) {
  return (
    <div className="task">
      <h3>{task.summary}</h3>
      <p>{task.description}</p>
      <button
        className="detailsButton"
        onClick={(task) => setTaskInFocus(task)}
      >
        {" "}
        See Details
      </button>
    </div>
  );
}

export default Task;
