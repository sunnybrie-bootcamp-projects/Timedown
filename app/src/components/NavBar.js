import React, { useState, useEffect } from "react";

function NavBar({ isAuthenticated, gcal, setTab, tab }) {
  return (
    <div className="navBar">
      <button
        id={tab === "calendar" ? "toggled" : "notToggled"}
        className="navTab"
        onClick={() => setTab("calendar")}
      >
        Calendar
      </button>
      <button
        id={tab === "taskboard" ? "toggled" : "notToggled"}
        className="navTab"
        onClick={() => setTab("taskboard")}
      >
        Taskboard
      </button>
    </div>
  );
}

export default NavBar;
