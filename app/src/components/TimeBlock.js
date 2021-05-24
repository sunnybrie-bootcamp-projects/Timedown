import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

const TimeBlock = ({
  start,
  end,
  summary,
  dayStart,
  type,
  setAction,
  setDetails,
  info,
}) => {
  const [gridRow, setGridRow] = useState("auto");
  const [gridColumn, setGridColumn] = useState("span 1");

  function getGridPlacement() {
    function minuteModify(time, edge) {
      let extra;
      if (edge === "start") {
        extra = -1;
      } else if (edge === "end") {
        extra = 2;
      }
      if (15 <= time.minute() < 30) {
        return 3 + extra;
      } else if (30 <= time.minute() < 45) {
        return 4 + extra;
      } else if (45 <= time.minute()) {
        return 5 + extra;
      }
      return extra + 2;
    }

    let blockStart =
      (start.hour() - dayStart.hours()) * 4 + minuteModify(start, "start");
    blockStart = blockStart <= 0 ? 2 : blockStart;

    let blockEnd =
      (end.hour() - dayStart.hours()) * 4 + minuteModify(end, "end");

    setGridRow(`${blockStart} / ${blockEnd < 0 ? "span all" : blockEnd}`);
    setGridColumn("span 1");
  }

  let eventMeasurements = {
    gridRow: gridRow,
    gridColumn: gridColumn,
  };

  function checkForDetails() {
    switch (type) {
      case "event":
      case "taskBlock":
        setDetails(info);
        setAction("readEvent");
        break;
      case "task":
        setDetails(info);
        setAction("readTask");
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    getGridPlacement();
  }, []);

  return (
    <div
      tabIndex={0}
      role="button"
      className={`timeBlock ${type}`}
      style={eventMeasurements}
      onClick={() => {
        checkForDetails();
      }}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === "Space") checkForDetails();
      }}
    >
      <p>{summary}</p>
    </div>
  );
};

export default TimeBlock;
