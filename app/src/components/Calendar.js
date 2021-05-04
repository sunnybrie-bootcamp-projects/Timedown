import React, { useState, useEffect } from "react";

import Day from "./Day";
import TimeLine from "./TimeLine";

function Calendar({ isAuthenticated, gcal }) {
  const [dayStart, setDayStart] = useState(new Date());
  const [dayEnd, setDayEnd] = useState(new Date());
  const [totalHours, setTotalHours] = useState(24);

  function setTimeRanges() {
    //Dummy data for rendering purposes, will be replaced with functions that read
    //from the user's settings and render the hours where the user is awake.
    let start = new Date();
    start.setHours(9, 0, 0, 0);
    let end = new Date();
    end.setHours(21, 0, 0, 0);

    setDayStart(start);
    setDayEnd(end);

    let total = new Date(dayEnd.valueOf() - dayStart.valueOf());
    console.debug({ total }); //TEST
    setTotalHours(total.getHours());
  }

  useEffect(() => {
    setTimeRanges();
  }, []);

  return (
    <div className="calendar">
      <TimeLine {...{ isAuthenticated, totalHours, dayStart }} />
      <Day {...{ isAuthenticated, gcal, dayStart, dayEnd, totalHours }} />
    </div>
  );
}

export default Calendar;
