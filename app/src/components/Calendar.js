import React, { useState, useEffect } from "react";

import Day from "./Day";

function Calendar({ isAuthenticated, gcal }) {
  return (
    <div className="calendar">
      <p>Calendar</p>
      <Day {...{ isAuthenticated, gcal }} />
    </div>
  );
}

const Events = ({ gcal }) => {
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    gcal
      .listUpcomingEvents(10)
      .then(({ result: { items } }) => setEvents(items));
  }, []);

  return events.length === 0 ? null : (
    <ul>
      {events.map((event) => (
        <li key={event.id}>{event.summary}</li>
      ))}
    </ul>
  );
};

export default Calendar;
