import React, { useState, useEffect } from "react";

import Calendar from "./Calendar.js";
import TaskBoard from "./TaskBoard.js";

function Planner() {
  return (
    <div className="planner">
      <p>Here goeth the planner!</p>
      <Calendar />
    </div>
  );
}

export default Planner;
