import React, { useState, useEffect } from "react";

import TimeBlock from "./TimeBlock.js";

function Day({ isAuthenticated, gcal }) {
  var startTime = new Date(
    "Mon May 03 2021 08:00:00 GMT-0700 (Pacific Daylight Time)",
  );
  var endTime = new Date().setHours(startTime.getHours() + 12);
  var totalHours = 12;
  var dayMeasurements = {
    gridTemplateRows: timeToRows(totalHours),
  };

  function timeToRows(total) {
    let template = [];
    let size = 100 / (total * 2);
    for (let i = 0; i < total; i += 0.5) {
      template.push(`${size}%`);
    }
    return template.join(" ");
  }

  //Parameters for getting the day's events
  var queryParams = {
    timeMin: startTime,
    timeMax: endTime,
    timeZone: "America/Los_Angeles",
    items: [{ id: "primary" }],
  };

  //Event Queries
  const [events, setEvents] = React.useState([]);

  function getEvents() {
    gcal.listUpcomingEvents(10).then(({ result: { items } }) => {
      setEvents(items);
    });
  }

  const [freeSpaces, setFreeSpaces] = React.useState([]);

  // function getFreeTime() {
  //   // gcal.gapi.client.calendar.freebusy
  //   //   .query(queryParams)
  //   //   .then(({ result: { items } }) => {
  //   //     setFreeSpaces(items);
  //   //     console.log(items);
  //   //   });

  //   let spaces = [];

  //   events.forEach((event, index) => {
  //     spaces.push({
  //       summary: "Free Time",
  //       start: event.end.dateTime,
  //       end: events[index + 1].start.dateTime,
  //     });
  //   });

  //   setFreeSpaces(spaces);
  // }

  React.useEffect(() => {
    if (isAuthenticated) {
      getEvents();
      //getFreeTime();
    }
  }, [isAuthenticated]);

  //Component load-in
  useEffect(() => {}, []);

  return (
    <div className="day" style={dayMeasurements}>
      {events.length === 0 ? (
        <p>You have no events for this day.</p>
      ) : (
        events.map((event) => (
          <TimeBlock
            className="event"
            key={event.id}
            start={event.start.dateTime}
            end={event.end.dateTime}
            summary={event.summary}
            dayStart={startTime}
          />
        ))
      )}
    </div>
  );
}

// const Events = ({ gcal, queryParams }) => {
//   const [events, setEvents] = React.useState([]);

//   React.useEffect(() => {
//     gcal
//       .listUpcomingEvents(10)
//       .then(({ result: { items } }) => setEvents(items));
//   }, []);

//   return events.length === 0 ? (
//     <p>You have no events for this day.</p>
//   ) : (
//       {events.map((event) => (
//         <TimeBlock className="event" key={event.id} summary={event.summary} />

//       ))}

//   );
// };

export default Day;
