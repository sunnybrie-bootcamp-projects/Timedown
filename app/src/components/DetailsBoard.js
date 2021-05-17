import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

import * as dbRequest from "../dbRequest";

import TaskAddForm from "./TaskAddForm";

//dayjs plugins
const AdvancedFormat = require("dayjs/plugin/advancedFormat");
const duration = require("dayjs/plugin/duration");
const isBetween = require("dayjs/plugin/isBetween");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(AdvancedFormat);
dayjs.extend(duration);
dayjs.extend(isBetween);

function DetailsBoard({
  user,
  gcal,
  action,
  details,
  setAction,
  setDetails,
  setTasksList,
  getTasksInfo,
  suggestions,
  setSuggestions,
}) {
  //Determines what to render based on the "action" state
  //Read details, edit, delete, or add new task
  function getDetails() {
    let infoToRender;
    switch (action) {
      case "addTask":
        infoToRender = (
          <TaskAddForm setTasksList={(e) => setTasksList(e)} {...{ user }} />
        );
        break;
      case "deleteTask":
        infoToRender = (
          <>
            <p>Are you sure you want to delete this task?</p>
            <p>{details.summary}</p>
            <button
              className="cancelButton"
              onClick={() => {
                setAction("readTask");
              }}
            >
              Cancel
            </button>
            <button
              className="deleteButton"
              onClick={() => {
                confirmDelete();
              }}
            >
              DELETE
            </button>
          </>
        );
        break;
      case "readTask":
        infoToRender = <TaskInfo {...{ setAction, details }} />;
        break;
      case "suggestTimes":
        infoToRender = (
          <Calibrator
            {...{ user, details, gcal, suggestions, setSuggestions }}
          />
        );
      default:
        break;
    }

    return infoToRender;
  }

  //Deletes task and refreshes task list
  async function confirmDelete() {
    let deletedTask = await dbRequest.deleteTask(details.id);
    getTasksInfo();
    setAction("");
    window.alert("Task deleted.", deletedTask);
  }

  return (
    <div
      className="detailsBoard"
      style={{ display: action === "" ? "none" : "block" }}
    >
      <button
        className="exitButton"
        onClick={() => {
          setAction("");
          setDetails({});
        }}
      >
        {" "}
        X
      </button>
      <h2>Details Board</h2>
      {getDetails()}
    </div>
  );
}

function TaskInfo({ details, setAction }) {
  return (
    <div className="taskInfo">
      <h2>{details.summary}</h2>
      <p className="taskDesc">{details.description}</p>
      <p className="taskDueDate">
        {new Date(details.dueDate).toLocaleString()}
      </p>
      <button
        value="suggestTimes"
        className="suggestButton"
        onClick={(e) => setAction(e.target.value)}
      >
        {" "}
        Suggest Times
      </button>
    </div>
  );
}

export default DetailsBoard;

const Calibrator = ({ gcal, user, details, suggestions, setSuggestions }) => {
  //dummy task
  const [testTask, setTestTask] = React.useState(details);

  const [currentDate, setCurrentDate] = React.useState(dayjs());
  const [timeRemaining, setTimeRemaining] = React.useState(""); //remaining time between now and duedate
  const [freeTimesRemaining, setFreeTimesRemaining] = React.useState([]); //remaining available time between now and due date
  const [totalFreeTime, setTotalFreeTime] = React.useState(dayjs.duration(0)); //sum total of free times remaining
  const [taskPriority, setTaskPriority] = React.useState(0);

  //user's settings
  const awakeTime = user.timedown.sleepTime;
  const eventBuffer = dayjs.duration(user.timedown.eventBuffer);

  //time remaining
  function getRemainingTime(dueDate, currentDate) {
    return dayjs(dueDate).fromNow();
  }

  //free time remaining
  async function getRemainingFreeTimes(dueDate, currentDate) {
    //Queries calendar for all events between now and duedate
    let timeBlocks = await gcal
      .listEvents({
        calendarId: "primary",
        timeMin: dayjs().toISOString(),
        timeMax: dayjs(dueDate).toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      })
      .then(function (response) {
        //All resulting events
        let busyArr = response.result.items;
        console.log({ busyArr });

        //All times between events
        let freeArr = [];

        //reduces busyArr to times in between, adds times to freeArr
        let busyReducer = (freeTime, busyTime) => {
          freeTime.end = dayjs(busyTime.start.dateTime);
          console.log(freeTime);

          freeArr.push(freeTime);

          return { start: dayjs(busyTime.end.dateTime) };
        };

        busyArr.reduce(busyReducer, { start: dayjs() });

        //filter out times that don't fit in user's sleep settings
        freeArr = freeArr.filter((freeTime) => {
          let range = {
            min: dayjs(freeTime.start)
              .hour(awakeTime.start.hours)
              .minute(awakeTime.start.minutes),
            max: dayjs(freeTime.end)
              .hour(awakeTime.end.hours)
              .minute(awakeTime.end.minutes),
          };

          let early = dayjs(freeTime.start).isBefore(range.start);
          let late = dayjs(freeTime.end).isAfter(range.end);
          let outOfRange = early && late;

          //if out of range, drop this time
          //if early/late, adjust time
          if (outOfRange) {
            return false;
          } else if (early) {
            freeTime.start = range.start;
          } else if (late) {
            freeTime.end = range.end;
          }

          let duration = dayjs.duration(
            dayjs(freeTime.start).diff(dayjs(freeTime.end)),
          );
          let minDuration = dayjs.duration(eventBuffer);

          if (duration < minDuration) {
            return false;
          } else {
            freeTime.duration = duration;
          }

          return true;
        });

        if (freeArr.length > 0) {
          return freeArr;
        } else {
          return ["You have no free time between now and the due date."];
        }
      });

    setFreeTimesRemaining(timeBlocks);
  }

  //reduce free times to total free time
  function getSumFreeTime() {
    //console.debug("getSumFreeTime()"); //Test

    // function getMilliseconds(total, current) {
    //   let addedTime = current.totalTime < 0 ? 0 : current.totalTime;
    //   return total + addedTime;
    // }

    // let msHours = 1000 * 60 * 60;
    // let msMinutes = 1000 * 60;

    // let totalMS = freeTimesRemaining.reduce(getMilliseconds, 0);
    // let hours = totalMS / msHours;
    // let minutes = (totalMS % msHours) / msMinutes;

    let sum = freeTimesRemaining.reduce((totalTime, additionTime) => {
      return totalTime.duration.add(additionTime.duration);
    }, dayjs.duration(0));

    setTotalFreeTime(sum);
  }

  //get proportion of each free time block
  function getFreeTimePercentages() {
    let update = freeTimesRemaining.map((freetime) => {
      freetime.freeTimePercentage =
        parseInt(freetime.totalTime) / totalFreeTime.totalMS;
      return freetime;
    });

    setFreeTimesRemaining(update);

    getSuggestions();
  }

  //get suggested time spent working on task
  function getSuggestions() {
    let task_hoursToMS = testTask.estTime.hours * 60 * 60 * 1000;
    let msHours = 1000 * 60 * 60;
    let msMinutes = 1000 * 60;

    let totals = freeTimesRemaining.map((time) => {
      let amount = time.freeTimePercentage * task_hoursToMS;
      let hours = Math.round(amount / msHours);
      let minutes = Math.round((amount % msHours) / msMinutes);

      return { totalMS: amount, hours, minutes };
    });

    setSuggestions(totals);
  }

  //USE EFFECTS
  //When component mounts, gets array of free timeblocks and total remaining time until due date
  React.useEffect(async () => {
    getRemainingFreeTimes(testTask.dueDate, currentDate);
    setTimeRemaining(getRemainingTime(testTask.dueDate, currentDate));
  }, []);

  //When length of freeTimesRemaining changes (aka they've loaded in)
  //Gets sum of all free time
  React.useEffect(() => {
    if (freeTimesRemaining.length !== 0) {
      try {
        getSumFreeTime();
      } catch (err) {
        console.debug("Error: ", err);
      }
    }
  }, [freeTimesRemaining.length]);

  //when total free time is calculated, calculates percentages
  React.useEffect(() => {
    if (totalFreeTime !== {}) {
      try {
        getFreeTimePercentages();
      } catch (err) {
        console.debug("Error: ", err);
      }
    }
  }, [totalFreeTime]);

  return (
    <div className="calibrator">
      <h4>Suggestions:</h4>
      <ol>
        {suggestions.map((time, index) => {
          let freeTime = dayjs(freeTimesRemaining[index].start).format(
            "ddd, MMM D, YYYY h:mm A",
          );
          let duration =
            time.totalMS >= 0
              ? `For: ${time.hours}hrs : ${time.minutes}min`
              : "Don't work at this time.";
          return (
            <li>
              <span className="when">{`When: ${freeTime}`}</span>
              <span className="duration">{`${duration}`}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
