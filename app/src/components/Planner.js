import React, { useState, useEffect } from "react";

import * as dbRequest from "../dbRequest";

import Calendar from "./Calendar.js";
import DetailsBoard from "./DetailsBoard.js";
import NavBar from "./NavBar.js";
import TaskBoard from "./TaskBoard.js";

function Planner({ isAuthenticated, gcal, user }) {
  //sets what tab is rendered
  const [tab, setTab] = useState("calendar");
  //Lists of Timedown User's tasks
  const [tasksList, setTasksList] = useState([]);
  //Determines what Details Board will render, if anything
  const [action, setAction] = useState("");
  //Information for Details Board to display
  const [details, setDetails] = useState({});
  //Timeblock suggestions - listed by details board and rendered as timeblocks on calendar
  const [suggestions, setSuggestions] = useState([]);

  //Fetches user's tasks
  async function getTasksInfo() {
    let data = JSON.stringify(await dbRequest.getTasks(user.timedown.id));
    let tasks = JSON.parse(data);

    setTasksList(tasks);
  }

  useEffect(() => {}, [tab]);

  return (
    <>
      <NavBar {...{ setTab, tab }} />
      <div className="planner">
        <Calendar {...{ isAuthenticated, tab, gcal, user }} />
        <TaskBoard
          {...{
            isAuthenticated,
            tab,
            gcal,
            user,
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
          gcal,
          user,
          setAction,
          action,
          setDetails,
          details,
          setTasksList,
          getTasksInfo,
          suggestions,
          setSuggestions,
        }}
      />
    </>
  );
}

export default Planner;
