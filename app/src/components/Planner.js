import React, { useState, useEffect } from "react";

import Calendar from "./Calendar.js";
import DetailsBoard from "./DetailsBoard.js";
import NavBar from "./NavBar.js";
import TaskBoard from "./TaskBoard.js";

function Planner({ isAuthenticated, gcal, timedownAccount }) {
  const [tab, setTab] = useState("calendar"); //sets what tab is rendered
  const [tasksList, setTasksList] = useState([]); //Lists of Timedown User's tasks
  const [action, setAction] = useState(""); //Determines what Details Board will render, if anything
  const [details, setDetails] = useState({}); //Information for Details Board to display

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
              tasksList,
              setTasksList,
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
      <DetailsBoard
        {...{
          timedownAccount,
          setAction,
          action,
          setDetails,
          details,
          setTasksList,
        }}
      />
    </>
  );
}

export default Planner;
