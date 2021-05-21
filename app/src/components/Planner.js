import React, { useState, useEffect, useLayoutEffect } from "react";

import dayjs from "dayjs";

import * as ApiClient from "../ApiClient";

import Account from "./Account";
import Calendar from "./Calendar.js";
import DetailsBoard from "./DetailsBoard.js";
import NavBar from "./NavBar.js";
import TaskBoard from "./TaskBoard.js";

//dayjs plugins
const AdvancedFormat = require("dayjs/plugin/advancedFormat");
const duration = require("dayjs/plugin/duration");
const isBetween = require("dayjs/plugin/isBetween");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(AdvancedFormat);
dayjs.extend(duration);
dayjs.extend(isBetween);

function Planner({
  isAuthenticated,
  isLoggedIn,
  setLoggedIn,
  gcal,
  user,
  setUser,
}) {
  const [isReady, setIsReady] = useState(false);
  //sets what tab is rendered
  const [tab, setTab] = useState("calendar");
  //Starting hour for day rendering
  const [dayStart, setDayStart] = useState(dayjs.duration());
  //Ending hour for day rendering
  const [dayEnd, setDayEnd] = useState(dayjs.duration());
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

  function setTimeRanges() {
    if (user.timedown.awakeTime) {
      let startArr = user.timedown.awakeTime.start.split(":");
      let startObj = {
        hours: parseInt(startArr[0]),
        minutes: parseInt(startArr[1]),
      };
      let start = dayjs.duration(startObj);

      let endArr = user.timedown.awakeTime.end.split(":");
      let endObj = {
        hours: parseInt(endArr[0]),
        minutes: parseInt(endArr[1]),
      };
      let end = dayjs.duration(endObj);

      setDayStart(start);
      setDayEnd(end);
    }
  }

  useLayoutEffect(() => {
    try {
      setTimeRanges();
    } catch (err) {
      window.alert(err);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {}, [tab]);

  if (isReady) {
    return (
      <>
        <NavBar {...{ tab, setTab, user }} />
        <div className="planner">
          <Calendar {...{ tab, gcal, user, dayStart, dayEnd, suggestions }} />
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
            dayStart,
            dayEnd,
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
  } else {
    return <p className="loadingMessage">Loading planner...</p>;
  }
}

export default Planner;
