import React, { useState, useEffect } from "react";

import Day from "./Day";
import TimeLine from "./TimeLine";

function Calendar({ isAuthenticated, gcal }) {
  const [dayStart, setDayStart] = useState(new Date());
  const [dayEnd, setDayEnd] = useState(new Date());
  const [totalHours, setTotalHours] = useState(24);
  const [timeRows, setTimeRows] = useState("");

  //sets Date states for rendering
  function setTimeRanges() {
    //Dummy data for rendering purposes, will be replaced with functions that read
    //from the user's settings and render the hours where the user is awake.
    let start = new Date();
    start.setHours(9, 0, 0, 0);
    let end = new Date();
    end.setHours(21, 0, 0, 0);

    setDayStart(start);
    setDayEnd(end);

    let total = end.getHours() - start.getHours();
    console.debug({ total }); //TEST
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

  useEffect(() => {
    setTimeRanges();
  }, []);

  useEffect(() => {
    timeToRows(totalHours);
  }, [totalHours]);

  return (
    <div className="calendar">
      <TimeLine {...{ timeRows, isAuthenticated, totalHours, dayStart }} />
      <Day
        {...{ timeRows, isAuthenticated, gcal, dayStart, dayEnd, totalHours }}
      />
    </div>
  );
}

export default Calendar;
