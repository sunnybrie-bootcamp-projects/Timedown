import React, { useState, useEffect } from "react";

//MAIN APP NAV BAR
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

//CALENDAR NAV BAR
export const CalendarNavBar = ({
  isAuthenticated,
  gcal,
  calView,
  setCalView,
  dateNavigation,
  setDateNavigation,
}) => {
  const [gridColumn, setGridColumn] = useState("2 / auto");

  //when user clicks "prev" or "next", tells dateNavigation how much to adjust the dates state by based on calView
  function prevNext(navNum) {
    switch (calView) {
      case "1day":
        setDateNavigation(dateNavigation + 1 * navNum);
        break;
      case "3day":
        setDateNavigation(dateNavigation + 3 * navNum);
        break;
      case "week":
        setDateNavigation(dateNavigation + 7 * navNum);
      default:
        break;
    }
  }

  useEffect(() => {
    switch (calView) {
      case "1day":
        setGridColumn("2 / span 1");
        break;
      case "3day":
        setGridColumn("2 / span 3");
        break;
      case "week":
        setGridColumn("2 / span 7");
        break;
      default:
        break;
    }
  }, [calView]);

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
        style={{ gridRow: "1", gridColumn: gridColumn }}
      >
        <button className="prev" onClick={() => prevNext(-1)}>
          prev
        </button>
        <span className="navTitle">Today</span>
        <button className="next" onClick={() => prevNext(1)}>
          next
        </button>
      </div>
    </>
  );
};

export default NavBar;
