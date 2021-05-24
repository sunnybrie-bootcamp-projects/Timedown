import React, { useEffect, useState, useCallback } from "react";

import dayjs from "dayjs";

import * as ApiClient from "../ApiClient";

//dayjs plugins
const AdvancedFormat = require("dayjs/plugin/advancedFormat");
const duration = require("dayjs/plugin/duration");
const isBetween = require("dayjs/plugin/isBetween");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(AdvancedFormat);
dayjs.extend(duration);
dayjs.extend(isBetween);

function Task({ task, setDetails, setAction }) {
  function seeDetails(action) {
    setDetails(task);
    setAction(action);
  }

  return (
    <tr className="task">
      <td headers="taskDueDate">
        {dayjs(task.dueDate).format("MMM D, 'YY")} <br />
        <i>{dayjs(task.dueDate).fromNow()}</i>
      </td>
      <td headers="taskSummary">{task.summary}</td>
      <td headers="taskProgress">Progress...</td>
      <td headers="taskOptions">
        <button
          value="deleteTask"
          className="deleteButton"
          onClick={(e) => seeDetails(e.target.value)}
        >
          Delete
        </button>
        <button
          value="readTask"
          className="detailsButton"
          onClick={(e) => seeDetails(e.target.value)}
        >
          {" "}
          See Details
        </button>
      </td>
    </tr>
  );
}

export default Task;
