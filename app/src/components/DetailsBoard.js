import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

import * as ApiClient from "../ApiClient";

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
    let deletedTask = await ApiClient.deleteTask(details.id);
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
