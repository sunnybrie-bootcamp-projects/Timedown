import React, { useEffect, useState, useCallback } from "react";

import * as dbRequest from "../dbRequest";

function Task({ task, setDetails, setAction }) {
  function seeDetails() {
    setDetails(task);
    setAction("readTask");
  }

  return (
    <div className="task">
      <h3>{task.summary}</h3>
      <p>{task.description}</p>
      <button className="detailsButton" onClick={() => seeDetails()}>
        {" "}
        See Details
      </button>
    </div>
  );
}

export default Task;
