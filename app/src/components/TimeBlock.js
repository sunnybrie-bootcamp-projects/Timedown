import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

const TimeBlock = ({ start, end, summary, dayStart }) => {
  const [gridRow, setGridRow] = useState("auto");
  const [gridColumn, setGridColumn] = useState("auto / span 1");

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

    var blockStart =
      (start.hour() - dayStart.hour()) * 4 + minuteModify(start, "start");
    blockStart = blockStart <= 0 ? 1 : blockStart;

    var blockEnd =
      (end.hour() - dayStart.hour()) * 4 + minuteModify(end, "end");

    setGridRow(`${blockStart} / ${blockEnd < 0 ? "span all" : blockEnd}`);
  }

  var eventMeasurements = {
    gridRow: gridRow,
    gridColumn: gridColumn,
  };

  useEffect(() => {
    getGridPlacement();
  }, []);

  return (
    <div className="event" style={eventMeasurements}>
      <p>{summary}</p>
    </div>
  );
};

export default TimeBlock;
