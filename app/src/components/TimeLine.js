import React, { useState, useEffect } from "react";

function TimeLine({ timeRows, isAuthenticated, dayStart, totalHours }) {
  //Returns an array of time objects at half-hour increments with row location
  //based on dayStart starting hour and totalHours
  function getTimes() {
    let timesToRender = [];
    for (let i = 0; i <= totalHours; i += 0.5) {
      let timeString = `${new Date(dayStart).getHours() + Math.floor(i)}`;
      if (i % 1 !== 0) {
        timeString += ":30";
      }
      let timeLineLocation = `${i * 2 + 1}`;

      timesToRender.push({ timeString, timeLineLocation });
    }

    return timesToRender;
  }

  useEffect(() => {
    getTimes();
  }, []);

  return (
    <div className="timeLine" style={{ gridTemplateRows: timeRows }}>
      {getTimes().map((time, index) => {
        return <TimeNotch key={`TimeNotch-${index}`} {...{ time }} />;
      })}
      <TimeIndicator {...{ dayStart }} />
    </div>
  );
}

function TimeNotch({ time }) {
  return (
    <div
      key={time.timeString}
      className="timeNotch"
      style={{ gridColumn: "1", gridRow: time.timeLineLocation }}
    >
      {time.timeString}
    </div>
  );
}

function TimeIndicator({ dayStart }) {
  const [indicatorRender, setIndicatorRender] = useState("");

  function findCurrentTime() {
    // console.log("findCurrentTime"); //TEST
    // console.debug({ dayStart }); //TEST
    let currTime = new Date();

    // console.debug({ currTime });

    let row =
      currTime.getMinutes() >= 30
        ? (currTime.getHours() - dayStart.getHours()) * 2 + 2
        : (currTime.getHours() - dayStart.getHours()) * 2 + 1;

    console.debug({ row }); //TEST
    setIndicatorRender(`${row}`);
  }

  useEffect(() => {
    findCurrentTime();
  });

  return (
    <div
      className="timeIndicator"
      style={{ gridRow: indicatorRender, gridColumn: "2" }}
    ></div>
  );
}

export default TimeLine;
