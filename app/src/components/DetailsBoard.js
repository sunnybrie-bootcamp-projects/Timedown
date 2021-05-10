import React, { useState, useEffect } from "react";

import TaskAddForm from "./TaskAddForm";

function DetailsBoard({ action, details }) {
  function getDetails() {
    let infoToRender;
    switch (action) {
      case "addTask":
        infoToRender = <p>Add task?</p>;
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
      <h2>Details Board</h2>
      {getDetails()}
    </div>
  );
}

export default DetailsBoard;
