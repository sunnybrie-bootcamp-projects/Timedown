import React, { useState, useEffect, useLayoutEffect } from "react";

import dayjs from "dayjs";

import * as ApiClient from "../ApiClient";
import * as ToggleOpen from "../assets/toggleLeft.png";
import * as ToggleShut from "../assets/toggleRight.png";

import Calibrator from "./Calibrator.js";
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
  dayStart,
  dayEnd,
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
  const [open, setOpen] = useState(false);
  //Determines what to render based on the "action" state
  //Read details, edit, delete, or add new task

  useEffect(() => {
    if (action !== "") {
      setOpen(true);
    }
  }, [action]);

  function getDetails() {
    let infoToRender;
    switch (action) {
      case "addTask":
        infoToRender = <TaskAddForm {...{ user, getTasksInfo }} />;
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
        infoToRender = <TaskInfo type="task" {...{ setAction, details }} />;
        break;
      case "readEvent":
        infoToRender = <TaskInfo type="event" {...{ setAction, details }} />;
        break;
      case "suggestTimes":
        infoToRender = (
          <Calibrator
            {...{
              user,
              dayStart,
              dayEnd,
              details,
              gcal,
              suggestions,
              setSuggestions,
            }}
          />
        );
      default:
        break;
    }

    return infoToRender;
  }

  //Deletes task and refreshes task list
  async function confirmDelete() {
    let deletedTask = await ApiClient.deleteTask(details.id);
    getTasksInfo();
    setAction("");
    window.alert("Task deleted.", deletedTask);
  }

  useLayoutEffect(() => {
    if (action !== "") {
      setOpen(true);
    }
  }, [action]);

  return (
    <div
      className="detailsBoard"
      style={{
        display: action === "" ? "none" : "block",
        right: open ? "0%" : "0%",
        height: open ? "90%" : "50%",
        width: open ? "max-content" : "1em",
        minWidth: open ? "fit-content" : "1em",
        maxWidth: open ? "min-content" : "1em",
        marginTop: open ? "auto" : "0",
      }}
    >
      <button
        className="toggleButton"
        alt="toggle details"
        tabIndex={0}
        role="button"
        style={{
          backgroundImage: open
            ? `url('https://raw.githubusercontent.com/sunnybrie/Timedown/user-settings/app/src/assets/toggleRight.png')`
            : `url('https://raw.githubusercontent.com/sunnybrie/Timedown/user-settings/app/src/assets/toggleLeft.png')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
        onClick={() => {
          setOpen(!open);
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === "Space") setOpen(!open);
        }}
      />
      <button
        className="exitButton"
        alt="exit details"
        style={{ display: open ? "block" : "none" }}
        onClick={() => {
          setAction("");
          setDetails({});
          setOpen(false);
        }}
      >
        X
      </button>
      <br />
      <div className="content" style={{ display: open ? "block" : "none" }}>
        {getDetails()}
      </div>
    </div>
  );
}

function TaskInfo({ details, setAction, type }) {
  return (
    <div className="taskInfo">
      <h2>{details.summary}</h2>
      <p className="taskDueDate">
        {type === "task" ? (
          `Due: ${new Date(details.dueDate).toLocaleString()}`
        ) : (
          <>
            <b>Starts:</b>{" "}
            {dayjs(details.start.dateTime).format(`ddd, MMM D, 'YY h:mma`)}
            <br />
            <b>Ends:</b>{" "}
            {dayjs(details.end.dateTime).format(`ddd, MMM D, 'YY h:mma`)}
          </>
        )}
      </p>
      <p className="taskDesc">{details.description}</p>
      {type === "task" ? (
        <button
          value="suggestTimes"
          className="suggestButton"
          onClick={(e) => setAction(e.target.value)}
        >
          {" "}
          Suggest Times
        </button>
      ) : (
        <p className="loadingMessage">This is not a Timedown task</p>
      )}
    </div>
  );
}

export default DetailsBoard;
