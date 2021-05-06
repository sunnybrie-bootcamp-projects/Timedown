import React, { useEffect, useState, useCallback } from "react";

import * as dbRequest from "../dbRequest";

function Task({ task }) {
  return (
    <div className="task">
      <h3>{task.summary}</h3>
      <p>{task.description}</p>
    </div>
  );
}

export default Task;
