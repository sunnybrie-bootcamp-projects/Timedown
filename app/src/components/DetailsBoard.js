import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

import * as dbRequest from "../dbRequest";

import TaskAddForm from "./TaskAddForm";

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
          <Calibrator {...{ details, gcal, suggestions, setSuggestions }} />
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

const Calibrator = ({ gcal, details, suggestions, setSuggestions }) => {
  //dummy task
  const [testTask, setTestTask] = React.useState(details);

  const [currentDate, setCurrentDate] = React.useState(dayjs());
  const [timeRemaining, setTimeRemaining] = React.useState(0); //remaining time between now and duedate
  const [freeTimesRemaining, setFreeTimesRemaining] = React.useState([]); //remaining available time between now and due date
  const [totalFreeTime, setTotalFreeTime] = React.useState({}); //sum total of free times remaining
  const [taskPriority, setTaskPriority] = React.useState(0);

  //time remaining
  function getRemainingTime(dueDate, currentDate) {
    return dayjs(currentDate).extend(dayjs(dueDate));
  }

  //free time remaining
  async function getRemainingFreeTimes(dueDate, currentDate) {
    //console.debug(`getRemainingFreeTimes(duedate, currentdate)`); //Test
    var timeBlocks = await gcal
      .listEvents({
        calendarId: "primary",
        timeMin: currentDate.toISOString(),
        timeMax: dayjs(dueDate).toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      })
      .then(function (response) {
        var busyArr = response.result.items;

        var freeArr = [];

        var busyReducer = (freeTime, busyTime) => {
          freeTime.end = busyTime.start;
          freeArr.push({ freeTime });

          return { start: busyTime.end };
        };

        busyArr.reduce(busyReducer, {
          start: {
            dateTime: currentDate.toISOString(),
            timeZone: "America/Los_Angeles",
          },
        });

        if (freeArr.length > 0) {
          return freeArr.map((freeTime, index) => {
            var { freeTime } = freeTime;
            var totalTime =
              new Date(freeTime.end.dateTime).getTime() -
              new Date(freeTime.start.dateTime).getTime();

            freeTime.totalTime = totalTime;

            return freeTime;
          });
        } else {
          return ["No free times. :["];
        }
      });

    setFreeTimesRemaining(timeBlocks);
  }

  //reduce free times to total free time
  function getSumFreeTime() {
    //console.debug("getSumFreeTime()"); //Test

    function getMilliseconds(total, current) {
      let addedTime = current.totalTime < 0 ? 0 : current.totalTime;
      return total + addedTime;
    }

    let msHours = 1000 * 60 * 60;
    let msMinutes = 1000 * 60;

    let totalMS = freeTimesRemaining.reduce(getMilliseconds, 0);
    let hours = totalMS / msHours;
    let minutes = (totalMS % msHours) / msMinutes;

    setTotalFreeTime({ totalMS: totalMS, hours: hours, minutes: minutes });
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

  return <div className="calibrator">Calibrator</div>;
};
