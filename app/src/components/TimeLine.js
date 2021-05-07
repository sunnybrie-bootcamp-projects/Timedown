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

      {getTimes().map((time, index) => {
        if (index === 0) {
          return <TimeIndicator {...{ dayStart }} />;
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
    let currTime = new Date();

    // console.debug({ currTime });

    let row =
      currTime.getMinutes() >= 30
        ? (currTime.getHours() - dayStart.getHours()) * 2 + 2
        : (currTime.getHours() - dayStart.getHours()) * 2 + 1;

    // console.debug({ row }); //TEST
    setIndicatorRender(`${row}`);
  }

  function getCurrentTime() {
    let currTime = new Date();
    let hour =
      currTime.getHours() <= 12
        ? currTime.getHours()
        : currTime.getHours() - 12;
    let minute =
      currTime.getMinutes() < 10
        ? `0${currTime.getMinutes()}`
        : currTime.getMinutes();
    let amPM = currTime.getHours() <= 11 ? "am" : "pm";

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
      <span class="currentTime">{getCurrentTime()}</span>
    </div>
  );
}

export default TimeLine;
