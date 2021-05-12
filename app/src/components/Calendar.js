import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

import Day from "./Day";
import { CalendarNavBar } from "./NavBar";
import TimeLine from "./TimeLine";

function Calendar({ isAuthenticated, gcal }) {
  const [calView, setCalView] = useState("1day");
  const [dayStart, setDayStart] = useState(new Date());
  const [dayEnd, setDayEnd] = useState(new Date());
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

  function getView() {
    switch (calView) {
      case "1day":
        return (
          <Day
            {...{
              timeRows,
              isAuthenticated,
              gcal,
              dayStart,
              dayEnd,
              totalHours,
            }}
          />
        );
        break;
      case "3day":
        let dates = [];
        for (let i = 0; i < 3; i++) {
          let newStart = dayjs(dayStart).add(i, "day");
          let newEnd = dayjs(dayEnd).add(i, "day");
          dates.push({ dayStart: newStart, dayEnd: newEnd });
        }

        return (
          <div className="threedayview">
            {dates.map((day) => {
              return (
                <Day
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
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    setTimeRanges();
  }, []);

  useEffect(() => {
    timeToRows(totalHours);
  }, [totalHours]);

  return (
    <div className="calendar">
      <CalendarNavBar {...{ calView, setCalView }} />
      <TimeLine {...{ timeRows, isAuthenticated, totalHours, dayStart }} />
      {getView()}
    </div>
  );
}

export default Calendar;
