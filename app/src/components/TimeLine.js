import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

function TimeLine({ timeRows, isAuthenticated, dayStart, totalHours }) {
  //Returns an array of time objects at half-hour increments with row location
  //based on dayStart starting hour and totalHours
  function getTimes() {
    let timesToRender = [];
    for (let i = 0; i <= totalHours; i += 0.5) {
      let value = dayjs(dayStart).add(Math.floor(i), "hour"); //creates dayjs object, determines hour
      let minute = i % 1 === 0 ? 0 : 30; //determines minute
      value = value.set("minute", minute); //sets minute

      let timeLineLocation = `${i * 2 + 1}`; //determines row to render on

      timesToRender.push({ value, timeLineLocation }); //pushes as object
    }

    return timesToRender;
  }

  useEffect(() => {
    getTimes();
  }, []);

  return (
    <div className="timeLine" style={{ gridTemplateRows: timeRows }}>
      {getTimes().map((time, index) => {
        return <TimeNotch key={`TN${index}`} {...{ time }} />;
      })}
      <TimeIndicator key={"TI"} {...{ dayStart }} />
    </div>
  );
}

function TimeNotch({ time }) {
  return (
    <div
      key={time.value.format("hh:mma")}
      className="timeNotch"
      style={{
        gridColumn: "1 / span 2",
        gridRow: time.timeLineLocation,
      }}
    >
      <span>{`${time.value.format("hh:mma")}`}</span>
    </div>
  );
}

function TimeIndicator({ dayStart }) {
  const [indicatorRender, setIndicatorRender] = useState("");
  const [currentTime, setCurrentTime] = useState(dayjs());
  //finds row placement for current time
  function findCurrentTime() {
    let row =
      currentTime.minute() >= 30
        ? (currentTime.hour() - dayjs(dayStart).hour()) * 2 + 2
        : (currentTime.hour() - dayjs(dayStart).hour()) * 2 + 1;

    setIndicatorRender(`${row}`);
  }

  useEffect(() => {
    findCurrentTime();
  });

  return (
    <div
      className="timeIndicator"
      style={{ gridRow: indicatorRender, gridColumn: "2" }}
    >
      <div className="timePointer"></div>
      <span className="currentTime">{currentTime.format("hh:mma")}</span>
    </div>
  );
}

export default TimeLine;
