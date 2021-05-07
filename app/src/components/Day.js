import React, { useState, useEffect } from "react";

function Day({ isAuthenticated, gcal, beginTime, endTime }) {
  var startTime = new Date();
  var endTime = new Date().setHours(startTime.getHours() + 12);

  var queryParams = {
    timeMin: startTime,
    timeMax: endTime,
    showDeleted: true,
    orderBy: "startTime",
  };

  useEffect(() => {}, []);

  return (
    <div className="day">
      <h2>Day</h2>
      {isAuthenticated ? <Events {...{ gcal, queryParams }} /> : null}
    </div>
  );
}

const Events = ({ gcal, queryParams }) => {
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    gcal
      .listUpcomingEvents(10)
      .then(({ result: { items } }) => setEvents(items));
  }, []);

  return events.length === 0 ? (
    <p>You have no evets for this day.</p>
  ) : (
    <ul>
      {events.map((event) => (
        <li key={event.id}>{event.summary}</li>
      ))}
    </ul>
  );
};

export default Day;
