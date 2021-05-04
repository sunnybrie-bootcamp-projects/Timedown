import React, { useState, useEffect } from "react";

function TimeLine({ isAuthenticated, dayStart, totalHours }) {
  const [timelineRender, setTimelineRender] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [indicatorRender, setIndicatorRender] = useState({});

  function timeToRows(total) {
    let template = [];
    let size = 100 / (total * 2);
    for (let i = 0; i < total; i += 0.5) {
      template.push(`${size}%`);
    }
    setTimelineRender({
      ...timelineRender,
      gridTemplateRows: template.join(" "),
    });
  }

  function placeCurrentTime() {
    //console.debug({ dayStart }); //TEST
    let row = currentTime.getHours() - dayStart.getHours();
    setIndicatorRender({ ...indicatorRender, gridRow: row });
  }

  //setInterval(tick({ setCurrentTime }), 1000);

  useEffect(() => {
    if (isAuthenticated) {
      timeToRows(totalHours);
      placeCurrentTime();
    }
  }, []);

  return (
    <div className="timeLine" style={timelineRender}>
      {}
      <div className="timeSpot" style={{ indicatorRender }}></div>
    </div>
  );
}

function tick({ setCurrentTime }) {
  setCurrentTime(new Date().toLocaleTimeString());
}

export default TimeLine;
