import React, { useState, useEffect } from "react";

function TimeLine({ timeRows, isAuthenticated, dayStart, totalHours }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [indicatorRender, setIndicatorRender] = useState("");

  function placeCurrentTime() {
    //console.debug({ dayStart }); //TEST
    let row = currentTime.getHours() - dayStart.getHours();
    setIndicatorRender(`${row}`);
  }

  //setInterval(tick({ setCurrentTime }), 1000);

  useEffect(() => {
    if (isAuthenticated) {
      placeCurrentTime();
    }
  });

  return (
    <div className="timeLine" style={{ gridTemplateRows: timeRows }}>
      {}
      <div className="timeSpot" style={{ gridRow: indicatorRender }}></div>
    </div>
  );
}

function tick({ setCurrentTime }) {
  setCurrentTime(new Date().toLocaleTimeString());
}

export default TimeLine;
