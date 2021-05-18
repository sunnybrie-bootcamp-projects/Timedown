import React, { useState, useEffect } from "react";

import * as ApiClient from "../ApiClient";

import Account from "./Account";
import Calendar from "./Calendar.js";
import DetailsBoard from "./DetailsBoard.js";
import NavBar from "./NavBar.js";
import TaskBoard from "./TaskBoard.js";

function Planner({
  isAuthenticated,
  isLoggedIn,
  setLoggedIn,
  gcal,
  user,
  setUser,
}) {
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
    let data = JSON.stringify(await ApiClient.getTasks(user.timedown.id));
    let tasks = JSON.parse(data);

    setTasksList(tasks);
  }

  useEffect(() => {}, [tab]);

  return (
    <>
      <NavBar {...{ tab, setTab, user }} />
      <div className="planner">
        <Calendar {...{ tab, isAuthenticated, gcal, user, suggestions }} />
        <TaskBoard
          {...{
            tab,
            isAuthenticated,
            gcal,
            user,
            getTasksInfo,
            tasksList,
            setTasksList,
            setDetails,
            setAction,
          }}
        />
        <Account
          {...{
            tab,
            isAuthenticated,
            isLoggedIn,
            setLoggedIn,
            gcal,
            user,
            setUser,
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
