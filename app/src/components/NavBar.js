import React, { useState, useEffect } from "react";

//MAIN APP NAV BAR
function NavBar({ tab, setTab, user }) {
  return (
    <div className="navBar">
      <button
        className={tab === "calendar" ? "navTab toggled" : "navTab notToggled"}
        onClick={() => setTab("calendar")}
      >
        <h2 className="navTitle">Calendar</h2>
      </button>
      <button
        className={tab === "taskboard" ? "navTab toggled" : "navTab notToggled"}
        onClick={() => setTab("taskboard")}
      >
        <h2 className="navTitle">Taskboard</h2>
      </button>
      <button
        id="accountTab"
        className={tab === "account" ? "navTab toggled" : "navTab notToggled"}
        onClick={() => setTab("account")}
      >
        {user.google.getImageUrl() ? (
          <img src={user.google.getImageUrl()} />
        ) : (
          <></>
        )}
        <h2 className="navTitle">Account</h2>
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
  days,
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
        <span>View Options:</span>
        <button
          className={
            calView === "1day" ? "navTab toggled" : "navTab notToggled"
          }
          onClick={() => setCalView("1day")}
        >
          1
        </button>
        <button
          className={
            calView === "3day" ? "navTab toggled" : "navTab notToggled"
          }
          onClick={() => setCalView("3day")}
        >
          3
        </button>
        <button
          className={
            calView === "week" ? "navTab toggled" : "navTab notToggled"
          }
          onClick={() => setCalView("week")}
        >
          7
        </button>
      </div>
      <div className="day navBar" style={{ gridRow: "1" }}>
        <button className="prev" onClick={() => prevNext(-1)}>
          prev
        </button>
        <h3 className="navTitle">
          {days.length > 1
            ? `${days[0].start.format("MMM D, YYYY")} - ${days[
                days.length - 1
              ].start.format("MMM D, YYYY")}`
            : `${days[0].start.format("MMM D, YYYY")}`}
        </h3>
        <button className="next" onClick={() => prevNext(1)}>
          next
        </button>
      </div>
    </>
  );
};

export default NavBar;
