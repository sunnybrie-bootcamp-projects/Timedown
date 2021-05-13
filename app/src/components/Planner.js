import React, { useState, useEffect } from "react";

import * as dbRequest from "../dbRequest";

import Calendar from "./Calendar.js";
import DetailsBoard from "./DetailsBoard.js";
import NavBar from "./NavBar.js";
import TaskBoard from "./TaskBoard.js";

function Planner({ isAuthenticated, gcal, timedownAccount }) {
  const [tab, setTab] = useState("calendar"); //sets what tab is rendered
  const [tasksList, setTasksList] = useState([]); //Lists of Timedown User's tasks
  const [action, setAction] = useState(""); //Determines what Details Board will render, if anything
  const [details, setDetails] = useState({}); //Information for Details Board to display

  //Fetches user's tasks
  async function getTasksInfo() {
    let data = JSON.stringify(await dbRequest.getTasks(timedownAccount.id));
    let tasks = JSON.parse(data);

    setTasksList(tasks);
  }

  useEffect(() => {}, [tab]);

  return (
    <>
      <NavBar {...{ setTab, tab }} />
      <div className="planner">
        <Calendar {...{ tab, isAuthenticated, gcal, timedownAccount }} />
        <TaskBoard
          {...{
            isAuthenticated,
            gcal,
            timedownAccount,
            tab,
            getTasksInfo,
            tasksList,
            setTasksList,
            setDetails,
            setAction,
          }}
        />
      </div>
      <DetailsBoard
        {...{
          timedownAccount,
          setAction,
          action,
          setDetails,
          details,
          setTasksList,
          getTasksInfo,
        }}
      />
    </>
  );
}

export default Planner;
