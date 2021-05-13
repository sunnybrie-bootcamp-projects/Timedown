import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

import Day from "./Day";
import { CalendarNavBar } from "./NavBar";
import TimeLine from "./TimeLine";

function Calendar({ isAuthenticated, gcal, timedownAccount }) {
  const [isReady, setIsReady] = useState(false);
  //Number of days the user wants to see
  const [calView, setCalView] = useState("1day");
  //Starting hour for day rendering
  const [dayStart, setDayStart] = useState(dayjs().hour(0));
  //Ending hour for day rendering
  const [dayEnd, setDayEnd] = useState(dayjs().hour(23));
  //Total hours rendered in a day
  const [totalHours, setTotalHours] = useState(24);
  //Days to be displayed in calendar
  const [days, setDays] = useState([
    { start: dayjs().hour(0), end: dayjs().hour(23) },
  ]);
  // Adjust days state when user clicks "previous" or "next" in navigation
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
    let size = 100 / (total * 4);
    for (let i = 0; i < total; i += 0.25) {
      template.push(`${size}%`);
    }
    setTimeRows(template.join(" "));
  }

  //gets the days to render based on calView uption, sets days state
  function getDates(num) {
    let newDates = [];
    for (let i = 0; i < num; i++) {
      let newStart = dayjs();
      newStart = newStart.hour(dayStart.hour()); //set starting time
      newStart = newStart.add(i + dateNavigation, "day"); //set day

      let newEnd = dayjs(dayEnd).add(i + dateNavigation, "day");
      newEnd = newEnd.hour(dayEnd.hour()); //set starting time
      newEnd = newEnd.add(i + dateNavigation, "day"); //set day

      newDates.push({ start: newStart, end: newEnd });
    }
    console.debug(newDates);
    setDays(newDates);

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

  //reads calView and updays states
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
    setIsReady(true);
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
      {days.map((day, index) => {
        return (
          <Day
            key={`D${index}`}
            {...{
              index,
              timeRows,
              isAuthenticated,
              gcal,
              day,
              dayStart,
            }}
          />
        );
      })}
    </div>
  );
}

export default Calendar;
