import React, { useState, useEffect } from "react";

import Calendar from "./Calendar.js";
import DetailsBoard from "./DetailsBoard.js";
import NavBar from "./NavBar.js";
import TaskBoard from "./TaskBoard.js";

function Planner({ isAuthenticated, gcal, timedownAccount }) {
  const [tab, setTab] = useState("calendar");
  const [details, setDetails] = useState({});
  const [action, setAction] = useState("");

  function getTab() {
    let visible;
    switch (tab) {
      case "calendar":
        visible = <Calendar {...{ isAuthenticated, gcal, timedownAccount }} />;
        break;
      case "taskboard":
        visible = (
          <TaskBoard
            {...{
              isAuthenticated,
              gcal,
              timedownAccount,
              setDetails,
              setAction,
            }}
          />
        );
        break;
      default:
        break;
    }

    return visible;
  }

  useEffect(() => {}, [tab]);

  return (
    <>
      <NavBar {...{ setTab, tab }} />
      <div className="planner">{getTab()}</div>
      <DetailsBoard {...{ action, setDetails, details }} />
    </>
  );
}

export default Planner;
