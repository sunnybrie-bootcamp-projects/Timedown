import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

const TimeBlock = ({ start, end, summary, dayStart }) => {
  function getGridPlacement() {
    //console.debug({ start }); //test
    var blockStart = (dayjs(start).hour() - dayjs(dayStart).hour()) * 2;
    //console.debug({ blockStart });
    blockStart = blockStart % 1 !== 0 ? blockStart + 2 : blockStart + 1;
    //console.debug({ blockStart });

    //console.debug({ end }); //test
    var blockEnd = (dayjs(end).hour() - dayjs(dayStart).hour()) * 2;
    //console.debug({ blockEnd });
    blockEnd = blockEnd % 1 !== 0 ? blockEnd + 2 : blockEnd + 1;
    //console.debug({ blockEnd });

    return `${blockStart} / ${blockEnd}`;
  }

  var eventMeasurements = {
    gridRow: getGridPlacement(),
    gridColumn: "auto / span 1",
  };

  return (
    <div className="event" style={eventMeasurements}>
      <p>{summary}</p>
    </div>
  );
};

export default TimeBlock;
