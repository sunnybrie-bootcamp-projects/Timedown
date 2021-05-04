import React, { useState, useEffect } from "react";

import Day from "./Day";
import TimeLine from "./TimeLine";

function Calendar({ isAuthenticated, gcal }) {
  return (
    <div className="calendar">
      <TimeLine />
      <Day {...{ isAuthenticated, gcal }} />
    </div>
  );
}

export default Calendar;
