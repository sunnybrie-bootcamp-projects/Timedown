import React, { useState, useEffect } from "react";

function NavBar({ isAuthenticated, gcal, setTab, tab }) {
  return (
    <div className="navBar">
      <button
        className={tab === "calendar" ? "navTab toggled" : "navTab notToggled"}
        onClick={() => setTab("calendar")}
      >
        Calendar
      </button>
      <button
        className={tab === "taskboard" ? "navTab toggled" : "navTab notToggled"}
        onClick={() => setTab("taskboard")}
      >
        Taskboard
      </button>
    </div>
  );
}

function CalendarNavBar({ isAuthenticated, gcal, calView, setCalView }) {
  return (
    <div className="navBar">
      View Options:
      <button
        className={calView === "1day" ? "navTab toggled" : "navTab notToggled"}
        onClick={() => setCalView("1day")}
      >
        1 Day
      </button>
      <button
        className={calView === "3day" ? "navTab toggled" : "navTab notToggled"}
        onClick={() => setCalView("3day")}
      >
        3 Days
      </button>
      <button
        className={calView === "week" ? "navTab toggled" : "navTab notToggled"}
        onClick={() => setCalView("week")}
      >
        Week
      </button>
    </div>
  );
}

export default NavBar;
