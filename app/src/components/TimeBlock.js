import React, { useState, useEffect } from "react";

const TimeBlock = ({ start, end, summary, dayStart }) => {
  var blockStart =
    Math.round(new Date(start).getHours() * 2) / 2 - dayStart.getHours();
  var blockEnd =
    Math.round(new Date(end).getHours() * 2) / 2 - dayStart.getHours();

  var eventMeasurements = {
    gridRowStart: `${blockStart}`,
    gridRowEnd: `${blockEnd}`,
    gridColumn: "span 1",
  };

  return (
    <div className="event" style={eventMeasurements}>
      <p>{summary}</p>
    </div>
  );
};

export default TimeBlock;
