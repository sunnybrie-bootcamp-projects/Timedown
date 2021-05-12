import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

function TimeLine({ timeRows, isAuthenticated, dayStart, totalHours }) {
  //Returns an array of time objects at half-hour increments with row location
  //based on dayStart starting hour and totalHours
  function getTimes() {
    let timesToRender = [];
    for (let i = 0; i <= totalHours; i += 0.5) {
      let timeString = `${dayjs(dayStart).hour() + Math.floor(i)}`;
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

      {getTimes().map((time, index) => {
        if (index === 0) {
          return <TimeIndicator key={"current-time"} {...{ dayStart }} />;
        }
        return <TimeNotch key={`TimeNotch-${index}-0`} time={null} />;
      })}
    </div>
  );
}

function TimeNotch({ time }) {
  return (
    <div
      key={time === null ? "blank" : time.timeString}
      className={time === null ? "timeNotch null" : "timeNotch"}
      style={{
        gridColumn: time === null ? "2" : "1",
        gridRow: time === null ? "auto" : time.timeLineLocation,
      }}
    >
      {time ? (
        <span>{time.timeString}</span>
      ) : (
        <span className="nullTime">space</span>
      )}
    </div>
  );
}

function TimeIndicator({ dayStart }) {
  const [indicatorRender, setIndicatorRender] = useState("");

  //finds row placement for current time
  function findCurrentTime() {
    // console.log("findCurrentTime"); //TEST
    // console.debug({ dayStart }); //TEST
    let currTime = dayjs();

    // console.debug({ currTime });

    let row =
      currTime.minute() >= 30
        ? (currTime.hour() - dayjs(dayStart).hour()) * 2 + 2
        : (currTime.hour() - dayjs(dayStart).hour()) * 2 + 1;

    // console.debug({ row }); //TEST
    setIndicatorRender(`${row}`);
  }

  function getCurrentTime() {
    let currTime = dayjs();
    let hour = currTime.hour() <= 12 ? currTime.hour() : currTime.hour() - 12;
    let minute =
      currTime.minute() < 10 ? `0${currTime.minute()}` : currTime.minute();
    let amPM = currTime.hour() <= 11 ? "am" : "pm";

    return `${hour}:${minute}${amPM}`;
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
      <span className="currentTime">{getCurrentTime()}</span>
    </div>
  );
}

export default TimeLine;
