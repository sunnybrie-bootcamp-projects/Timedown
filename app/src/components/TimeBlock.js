import React, { useState, useEffect } from "react";

const TimeBlock = ({ start, end, summary, dayStart }) => {
  function getGridPlacement() {
    console.debug({ start }); //test
    var blockStart = (new Date(start).getHours() - dayStart.getHours()) * 2;
    console.debug({ blockStart });
    blockStart = blockStart % 1 !== 0 ? blockStart + 2 : blockStart + 1;
    console.debug({ blockStart });

    console.debug({ end }); //test
    var blockEnd = (new Date(end).getHours() - dayStart.getHours()) * 2;
    console.debug({ blockEnd });
    blockEnd = blockEnd % 1 !== 0 ? blockEnd + 1 : blockEnd;
    console.debug({ blockEnd });

    return `${blockStart} / ${blockEnd}`;
  }

  var eventMeasurements = {
    gridRow: getGridPlacement(),
    gridColumn: "span 1",
  };

  return (
    <div className="event" style={eventMeasurements}>
      <p>{summary}</p>
    </div>
  );
};

export default TimeBlock;
