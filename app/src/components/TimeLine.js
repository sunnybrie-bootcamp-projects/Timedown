import React, { useState, useEffect } from "react";

function TimeLine({ isAuthenticated, gcal, beginTime, endTime }) {
  var startTime = new Date(
    "Mon May 03 2021 08:00:00 GMT-0700 (Pacific Daylight Time)",
  );
  var endTime = new Date().setHours(startTime.getHours() + 12);
  var totalHours = 12;
  var dayMeasurements = {
    gridTemplateRows: timeToRows(totalHours),
  };
  var currentTimeSpot = `${getCurrentTime()}`;

  function timeToRows(total) {
    let template = [];
    let size = 100 / (total * 2);
    for (let i = 0; i < total; i += 0.5) {
      template.push(`${size}%`);
    }
    return template.join(" ");
  }

  function getCurrentTime() {
    return new Date().getHours() - startTime.getHours();
  }

  //setInterval(tick({ setCurrentTime }), 1000);

  useEffect(() => {}, []);

  return (
    <div className="timeLine" style={dayMeasurements}>
      <div className="timeSpot" style={{ gridRow: currentTimeSpot }}>
        >
      </div>
    </div>
  );
}

function tick({ setCurrentTime }) {
  setCurrentTime(new Date().toLocaleTimeString());
}

export default TimeLine;
