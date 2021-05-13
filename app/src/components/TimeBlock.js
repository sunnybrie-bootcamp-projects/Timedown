import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

const TimeBlock = ({ start, end, summary, dayStart }) => {
  const [gridRow, setGridRow] = useState("auto");
  const [gridColumn, setGridColumn] = useState("auto / span 1");

  function getGridPlacement() {
    var blockStart = (start.hour() - dayStart.hour()) * 2;
    blockStart = blockStart <= 0 ? 1 : blockStart;

    var blockEnd = (end.hour() - dayStart.hour()) * 2;
    blockEnd = blockEnd <= 0 ? 1 : blockEnd;

    setGridRow(`${blockStart} / ${blockEnd}`);
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
