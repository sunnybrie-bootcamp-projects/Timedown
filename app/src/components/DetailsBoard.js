import React, { useState, useEffect } from "react";

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
        infoToRender = <TaskInfo {...{ setAction, details }} />;
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

  return (
    <div
      className="detailsBoard"
      style={{
        display: action === "" ? "none" : "block",
        right: open ? "10%" : "-80%",
        height: open ? "100%" : "50%",
      }}
    >
      <button
        className="toggleButton"
        alt="toggle details"
        style={{
          background: open ? `url('${ToggleShut}')` : `url('${ToggleOpen}')`,
        }}
        onClick={() => {
          setOpen(!open);
        }}
      />
      <button
        className="exitButton"
        alt="exit details"
        onClick={() => {
          setAction("");
          setDetails({});
          setOpen(false);
        }}
      >
        X
      </button>
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
