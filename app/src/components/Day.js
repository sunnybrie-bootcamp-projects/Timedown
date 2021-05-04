import React, { useState, useEffect } from "react";

import TimeBlock from "./TimeBlock.js";

function Day({ isAuthenticated, gcal, dayStart, dayEnd, totalHours }) {
  //inline styling for day based on user settings
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
  const [queryOptions, setQueryOptions] = useState({
    calendarId: "primary",
    orderBy: "startTime",
    timeMin: new Date(),
    timeMax: new Date(),
    timeZone: "America/Los_Angeles",
    showDeleted: false,
    singleEvents: true,
  });

  //Event Queries
  const [events, setEvents] = React.useState([]);

  function getEvents() {
    gcal
      .listEvents(queryOptions, queryOptions.calendarId)
      .then(({ result }: any) => {
        console.log(result.items);
        setEvents(result.items);
      });
  }

  React.useEffect(() => {
    if (isAuthenticated) {
      getEvents();
    }
  }, [isAuthenticated]);

  //Component load-in
  useEffect(() => {
    setQueryOptions({ ...queryOptions, timeMax: dayEnd, timeMin: dayStart });

    if (isAuthenticated) {
      getEvents();
    }
  }, []);

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
            dayStart={dayStart}
          />
        ))
      )}
    </div>
  );
}

// const Events = ({ gcal, queryOptions }) => {
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
