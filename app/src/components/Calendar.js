import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

import Day from "./Day";
import { CalendarNavBar } from "./NavBar";
import TimeLine from "./TimeLine";

function Calendar({ isAuthenticated, gcal, timedownAccount }) {
  //Number of days the user wants to see
  const [calView, setCalView] = useState("1day");
  //Starting hour for day rendering
  const [dayStart, setDayStart] = useState(dayjs());
  //Ending hour for day rendering
  const [dayEnd, setDayEnd] = useState(dayjs());
  //Total hours rendered in a day
  const [totalHours, setTotalHours] = useState(24);
  //Days to be displayed in calendar
  const [dates, setDates] = useState([
    { dayStart: dayjs().hour(0), dayEnd: dayjs().hour(23) },
  ]);
  // Adjust dates state when user clicks "previous" or "next" in navigation
  const [dateNavigation, setDateNavigation] = useState(0);
  //Sets Calendar's columns based on calView
  const [dayColumns, setDayColumns] = useState("1fr 4fr");
  //Sets the rows for TimeLine and Day components, based on total hours
  const [timeRows, setTimeRows] = useState("");

  //sets dayStart, dayEnd, and totalHours states for rendering
  function setTimeRanges() {
    if (timedownAccount.sleepTime) {
      let start = dayjs().hour(timedownAccount.sleepTime.start.hours);
      let end = dayjs().hour(timedownAccount.sleepTime.end.hours);

      setDayStart(start);
      setDayEnd(end);

      let total = dayjs(end).hour() - dayjs(start).hour();
      // console.debug({ total }); //TEST
      setTotalHours(total);
    }
  }

  //generates string for timeRows state
  function timeToRows(total) {
    let template = [];
    let size = 100 / (total * 2);
    for (let i = 0; i < total; i += 0.5) {
      template.push(`${size}%`);
    }
    setTimeRows(template.join(" "));
  }

  //gets the dates to render based on calView uption, sets dates state
  function getDates(num) {
    let newDates = [];
    for (let i = 0; i < num; i++) {
      let newStart = dayjs(dayStart).add(i + dateNavigation, "day");
      let newEnd = dayjs(dayEnd).add(i + dateNavigation, "day");
      newDates.push({ dayStart: newStart, dayEnd: newEnd });
    }
    console.debug(newDates);
    setDates(newDates);

    let newDayColumns =
      newDates.length === 1
        ? "1fr 4fr"
        : "1fr".concat(
            newDates
              .map((date, index) => {
                return " 2fr";
              })
              .join(""),
          );

    console.debug("setting columns...", newDayColumns);

    setDayColumns(newDayColumns);
  }

  //reads calView and updates states
  function getView() {
    switch (calView) {
      case "1day":
        getDates(1);
        break;
      case "3day":
        getDates(3);
        break;
      case "week":
        getDates(7);
      default:
        break;
    }
  }

  //USE EFFECTS

  useEffect(() => {
    setTimeRanges();
    getView();
  }, [timedownAccount.sleepTime]);

  useEffect(() => {
    timeToRows(totalHours);
  }, [totalHours]);

  useEffect(() => {
    getView();
  }, [calView]);

  return (
    <div
      className="calendar"
      style={{
        gridTemplateColumns: dayColumns,
      }}
    >
      <CalendarNavBar
        {...{ calView, setCalView, dateNavigation, setDateNavigation }}
      />
      <TimeLine {...{ timeRows, isAuthenticated, totalHours, dayStart }} />
      {dates.map((day, index) => {
        return (
          <Day
            {...{
              index,
              timeRows,
              isAuthenticated,
              gcal,
              ...day,
              dayStart,
              totalHours,
            }}
          />
        );
      })}
    </div>
  );
}

export default Calendar;
