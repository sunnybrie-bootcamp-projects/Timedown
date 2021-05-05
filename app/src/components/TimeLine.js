import React, { useState, useEffect } from "react";

function TimeLine({ timeRows, isAuthenticated, dayStart, totalHours }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [indicatorRender, setIndicatorRender] = useState("");
  const [times, setTimes] = useState([]);

  function getTimes() {
    console.debug(new Date(dayStart).getHours()); //TEST)
    let timesToRender = [];
    for (let i = 0; i <= totalHours; i += 0.5) {
      let timeString = `${new Date(dayStart).getHours() + Math.floor(i)}`;
      if (i % 1 !== 0) {
        timeString += ":30";
      }
      let timeLineLocation = `${i * 2 + 1}`;

      timesToRender.push({ timeString, timeLineLocation });
    }

    setTimes(timesToRender);
  }

  function placeCurrentTime() {
    //console.debug({ dayStart }); //TEST
    let row = currentTime.getHours() - dayStart.getHours();
    setIndicatorRender(`${row}`);
  }

  //setInterval(tick({ setCurrentTime }), 1000);

  useEffect(() => {
    getTimes();
  }, []);

  useEffect(() => {
    placeCurrentTime();
  });

  return (
    <div className="timeLine" style={{ gridTemplateRows: timeRows }}>
      {times.map((time) => {
        return (
          <div
            key={time.timeString}
            className="timeNotch"
            style={{ gridColumn: "1", gridRow: time.timeLineLocation }}
          >
            {time.timeString}
          </div>
        );
      })}
      <div
        className="timeSpot"
        style={{ gridRow: indicatorRender, gridColumn: "2" }}
      ></div>
    </div>
  );
}

function tick({ setCurrentTime }) {
  setCurrentTime(new Date().toLocaleTimeString());
}

export default TimeLine;
