import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

const TimeBlock = ({ start, end, summary, dayStart, type }) => {
  const [gridRow, setGridRow] = useState("auto");
  const [gridColumn, setGridColumn] = useState("1 / span 1");

  function getGridPlacement() {
    function minuteModify(time, edge) {
      let extra;
      if (edge === "start") {
        extra = -1;
      } else if (edge === "end") {
        extra = 1;
      }
      if (15 <= time.minute() < 30) {
        return 2 + extra;
      } else if (30 <= time.minute() < 45) {
        return 3 + extra;
      } else if (45 <= time.minute()) {
        return 4 + extra;
      }
      return extra;
    }

    let blockStart =
      (start.hour() - dayStart.hours()) * 4 + minuteModify(start, "start");
    blockStart = blockStart <= 0 ? 1 : blockStart;

    let blockEnd =
      (end.hour() - dayStart.hours()) * 4 + minuteModify(end, "end");

    setGridRow(`${blockStart} / ${blockEnd < 0 ? "span all" : blockEnd}`);
    setGridColumn(type === "suggestion" ? "1 / auto" : gridColumn);
  }

  let eventMeasurements = {
    gridRow: gridRow,
    gridColumn: gridColumn,
  };

  useEffect(() => {
    getGridPlacement();
  }, []);

  return (
    <div className={`timeBlock ${type}`} style={eventMeasurements}>
      <p>{summary}</p>
    </div>
  );
};

export default TimeBlock;
