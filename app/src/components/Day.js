import React, { useState, useEffect } from "react";

import TimeBlock from "./TimeBlock.js";

function Day({
  timeRows,
  isAuthenticated,
  gcal,
  dayStart,
  dayEnd,
  totalHours,
}) {
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

  //Component load-in...
  useEffect(() => {
    setQueryOptions({
      ...queryOptions,
      timeMax: dayEnd.toISOString(),
      timeMin: dayStart.toISOString(),
    });
  }, []);
  //After day's parameters are set...
  useEffect(() => {
    if (isAuthenticated) {
      getEvents();
    }
  }, [queryOptions]);

  useEffect(() => {}, []);

  return (
    <div className="day" style={{ gridTemplateRows: timeRows }}>
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
