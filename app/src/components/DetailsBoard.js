import React, { useState, useEffect } from "react";

import * as dbRequest from "../dbRequest";

import TaskAddForm from "./TaskAddForm";

function DetailsBoard({
  timedownAccount,
  action,
  details,
  setAction,
  setDetails,
  setTasksList,
}) {
  //Determines what to render based on the "action" state
  //Read details, edit, delete, or add new task
  function getDetails() {
    let infoToRender;
    switch (action) {
      case "addTask":
        infoToRender = (
          <TaskAddForm
            setTasksList={(e) => setTasksList(e)}
            {...{ timedownAccount }}
          />
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
        infoToRender = <h3>{details.summary}</h3>;
        break;
      default:
        break;
    }

    return infoToRender;
  }

  //Upon confirmation
  async function confirmDelete() {
    let deletedTask = await dbRequest.deleteTask(details.id);
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

export default DetailsBoard;
