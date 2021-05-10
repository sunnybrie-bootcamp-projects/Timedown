import React, { useState, useEffect } from "react";

import TaskAddForm from "./TaskAddForm";

function DetailsBoard({
  timedownAccount,
  action,
  details,
  setAction,
  setDetails,
  setTasksList,
}) {
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
      case "readTask":
        infoToRender = <h3>{details.summary}</h3>;
        break;
      default:
        break;
    }

    return infoToRender;
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
