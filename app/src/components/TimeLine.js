import React, { useState, useEffect } from "react";

function TimeLine({ isAuthenticated, gcal, beginTime, endTime }) {
  var startTime = new Date();
  var endTime = new Date().setHours(startTime.getHours() + 12);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString(),
  );

  //setInterval(tick({ setCurrentTime }), 1000);

  var queryParams = {
    timeMin: startTime,
    timeMax: endTime,
    showDeleted: true,
    orderBy: "startTime",
  };

  useEffect(() => {}, []);

  return (
    <div className="timeLine">
      <h2>Time</h2>
      <p>{currentTime}</p>
    </div>
  );
}

function tick({ setCurrentTime }) {
  setCurrentTime(new Date().toLocaleTimeString());
}

export default TimeLine;
