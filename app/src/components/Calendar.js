import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

import Day from "./Day";
import { CalendarNavBar } from "./NavBar";
import TimeLine from "./TimeLine";

function Calendar({ isAuthenticated, gcal, timedownAccount }) {
  const [calView, setCalView] = useState("1day");
  const [dayStart, setDayStart] = useState(dayjs());
  const [dayEnd, setDayEnd] = useState(dayjs());
  const [dates, setDates] = useState([
    { dayStart: dayjs().hour(0), dayEnd: dayjs().hour(20) },
  ]);
  const [totalHours, setTotalHours] = useState(24);
  const [timeRows, setTimeRows] = useState("");

  //sets Date states for rendering
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

  //sets number of rows for inline-styling
  function timeToRows(total) {
    let template = [];
    let size = 100 / (total * 2);
    for (let i = 0; i < total; i += 0.5) {
      template.push(`${size}%`);
    }
    setTimeRows(template.join(" "));
  }

  function getDates(num) {
    let newDates = [];
    for (let i = 0; i < num; i++) {
      let newStart = dayjs(dayStart).add(i, "day");
      let newEnd = dayjs(dayEnd).add(i, "day");
      newDates.push({ dayStart: newStart, dayEnd: newEnd });
    }
    console.debug(newDates);
    setDates(newDates);
  }

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
        gridAutoColumns:
          "1fr" +
          dates.map(() => {
            " 2fr";
          }),
      }}
    >
      <CalendarNavBar {...{ calView, setCalView }} />
      <TimeLine {...{ timeRows, isAuthenticated, totalHours, dayStart }} />
      {dates.map((day) => {
        return (
          <Day
            key={dayjs(day).date()}
            {...{
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
