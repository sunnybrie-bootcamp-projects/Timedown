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

export const CalendarNavBar = ({
  isAuthenticated,
  gcal,
  calView,
  setCalView,
}) => {
  return (
    <>
      <div
        className="calViewOptions"
        style={{ gridRow: "1", gridColumn: "1 / span 1" }}
      >
        View Options:
        <button
          className={
            calView === "1day" ? "navTab toggled" : "navTab notToggled"
          }
          onClick={() => setCalView("1day")}
        >
          1 Day
        </button>
        <button
          className={
            calView === "3day" ? "navTab toggled" : "navTab notToggled"
          }
          onClick={() => setCalView("3day")}
        >
          3 Days
        </button>
        <button
          className={
            calView === "week" ? "navTab toggled" : "navTab notToggled"
          }
          onClick={() => setCalView("week")}
        >
          Week
        </button>
      </div>
      <div
        className="day navBar"
        style={{ gridRow: "1", gridColumn: "2 / auto" }}
      >
        <button className="prev">prev</button>
        <span className="navTitle">Today</span>
        <button className="next">next</button>
      </div>
    </>
  );
};

export default NavBar;
