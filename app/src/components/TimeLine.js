import React, { useState, useEffect, useLayoutEffect } from "react";

import dayjs from "dayjs";

function TimeLine({ timeRows, isAuthenticated, dayStart }) {
  //Returns an array of time objects at half-hour increments with row location
  //based on dayStart starting hour and totalHours
  function getTimes() {
    let timesToRender = [];
    for (let i = 0; i < (timeRows.split(" ").length - 1) / 4; i += 0.25) {
      let value = dayjs().hour(dayStart.hours());
      value = value.add(Math.floor(i), "hour"); //creates dayjs object, determines hour
      let minute;
      if (i % 1 === 0.25) {
        minute = 15;
      } else if (i % 1 === 0.5) {
        minute = 30;
      } else if (i % 1 === 0.75) {
        minute = 45;
      } else {
        minute = 0;
      }
      value = value.set("minute", minute); //sets minute

      let timeLineLocation = `${i * 4 + 2}`; //determines row to render on

      timesToRender.push({ value, timeLineLocation }); //pushes as object
    }

    return timesToRender;
  }

  useLayoutEffect(() => {
    getTimes();
  }, []);

  return (
    <div className="timeLine" style={{ gridTemplateRows: timeRows }}>
      <h3 className="dateTimeHeader">Time</h3>
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
      <span
        className={
          time.value.minute() === 0 || time.value.minute() === 30
            ? "time"
            : "notch"
        }
      >
        {time.value.minute() === 0 || time.value.minute() === 30
          ? `${time.value.format("hh:mma")}`
          : "-"}
      </span>
    </div>
  );
}

function TimeIndicator({ dayStart }) {
  const [indicatorRender, setIndicatorRender] = useState("");
  const [currentTime, setCurrentTime] = useState(dayjs());
  //finds row placement for current time
  function findCurrentTime() {
    let minuteModify = 3;
    if (15 <= currentTime.minute() < 30) {
      minuteModify = 4;
    } else if (30 <= currentTime.minute() < 45) {
      minuteModify = 5;
    } else if (45 <= currentTime.minute()) {
      minuteModify = 6;
    }
    let row = (currentTime.hour() - dayStart.hours()) * 4 + minuteModify;

    setIndicatorRender(`${row}`);
  }

  useEffect(() => {
    findCurrentTime();
  });

  return (
    <div
      className="timeIndicator"
      style={{ gridRow: indicatorRender, gridColumn: "1 / span 2" }}
    >
      <div className="timePointer"></div>
      <span className="currentTime">{currentTime.format("h:mma")}</span>
    </div>
  );
}

export default TimeLine;
