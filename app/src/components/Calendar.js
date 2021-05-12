import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

import Day from "./Day";
import { CalendarNavBar } from "./NavBar";
import TimeLine from "./TimeLine";

function Calendar({ isAuthenticated, gcal }) {
  const [calView, setCalView] = useState("1day");
  const [dayStart, setDayStart] = useState(new Date());
  const [dayEnd, setDayEnd] = useState(new Date());
  const [dates, setDates] = useState([]);
  const [totalHours, setTotalHours] = useState(24);
  const [timeRows, setTimeRows] = useState("");

  //sets Date states for rendering
  function setTimeRanges() {
    let start = new Date();
    start.setHours(9, 0, 0, 0);
    let end = new Date();
    end.setHours(21, 0, 0, 0);

    setDayStart(start);
    setDayEnd(end);

    let total = end.getHours() - start.getHours();
    // console.debug({ total }); //TEST
    setTotalHours(total);
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
      dates.push({ dayStart: newStart, dayEnd: newEnd });
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
    getDates(1);
    getView();
  }, []);

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
              totalHours,
            }}
          />
        );
      })}
    </div>
  );
}

export default Calendar;
