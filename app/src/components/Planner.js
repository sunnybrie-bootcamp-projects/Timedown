import React, { useState, useEffect } from "react";

import Calendar from "./Calendar.js";
import NavBar from "./NavBar.js";
import TaskBoard from "./TaskBoard.js";

function Planner({ isAuthenticated, gcal }) {
  const [tab, setTab] = useState("calendar");

  function getTab() {
    let visible;
    switch (tab) {
      case "calendar":
        visible = <Calendar {...{ isAuthenticated, gcal }} />;
        break;
      case "taskboard":
        visible = <TaskBoard {...{ isAuthenticated, gcal }} />;
        break;
      default:
        break;
    }

    return visible;
  }

  useEffect(() => {}, [tab]);

  return (
    <>
      <NavBar {...{ setTab }} />
      <div className="planner">
        <p>Here goeth the planner!</p>
        {getTab()}
      </div>
    </>
  );
}

export default Planner;
