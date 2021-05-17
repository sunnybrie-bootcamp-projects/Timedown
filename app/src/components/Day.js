import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

import TimeBlock from "./TimeBlock.js";

function Day({ index, timeRows, isAuthenticated, gcal, day, dayStart }) {
  //Parameters for getting the day's events
  // const [queryOptions, setQueryOptions] = useState({
  //   calendarId: "primary",
  //   orderBy: "startTime",
  //   timeMin: new Date(),
  //   timeMax: new Date(),
  //   timeZone: "America/Los_Angeles",
  //   showDeleted: false,
  //   singleEvents: true,
  // });

  const [min, setMin] = useState(dayjs().toISOString());
  const [max, setMax] = useState(dayjs().toISOString());
  const queryOptions = {
    calendarId: "primary",
    orderBy: "startTime",
    timeMin: min,
    timeMax: max,
    timeZone: "America/Los_Angeles",
    showDeleted: false,
    singleEvents: true,
  };

  //Google Calendar Events
  const [events, setEvents] = React.useState([]);

  function getEvents() {
    gcal
      .listEvents(queryOptions, queryOptions.calendarId)
      .then(({ result }: any) => {
        //console.log(result.items);
        setEvents(result.items);
      });
  }

  //Component load-in...
  useEffect(() => {
    // setQueryOptions({
    //   ...queryOptions,
    //   timeMax: dayEnd.toISOString(),
    //   timeMin: dayStart.toISOString(),
    // });
    setMin(dayjs(day.start).toISOString());
    setMax(dayjs(day.end).toISOString());
  });

  //After day's parameters are set...
  useEffect(() => {
    if (isAuthenticated) {
      getEvents();
    }
  }, [min, max, isAuthenticated]);

  // useEffect(() => {}, []);

  return (
    <div
      className="day"
      style={{
        gridTemplateRows: timeRows,
        gridColumn: `${index + 2} / span 1`,
        gridRow: "2 / span 1",
      }}
    >
      {events.length === 0 ? (
        <p>You have no events for this day.</p>
      ) : (
        events.map((event) => (
          <TimeBlock
            className="event"
            key={`TB${event.id}`}
            start={dayjs(event.start.dateTime)}
            end={dayjs(event.end.dateTime)}
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
