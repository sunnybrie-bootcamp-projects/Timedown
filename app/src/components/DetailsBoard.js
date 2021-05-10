import React, { useState, useEffect } from "react";

function DetailsBoard({ action, taskInFocus }) {
  function getDetails() {
    let infoToRender;
    switch (action) {
      case "addTask":
        break;
      case "readTask":
        break;
      default:
        break;
    }
  }

  return (
    <div className="detailsBoard">
      <h2>Details Board</h2>
    </div>
  );
}

export default DetailsBoard;
