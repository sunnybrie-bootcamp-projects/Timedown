import React, { useState, useEffect, useReducer, useLayoutEffect } from "react";

import dayjs from "dayjs";

import TimeBlock from "./TimeBlock.js";

//dayjs plugins
const AdvancedFormat = require("dayjs/plugin/advancedFormat");
const duration = require("dayjs/plugin/duration");
const isBetween = require("dayjs/plugin/isBetween");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(AdvancedFormat);
dayjs.extend(duration);
dayjs.extend(isBetween);

function Day({ index, timeRows, gcal, day, dayStart, suggestions, calView }) {
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
  const [min, setMin] = useState(day.start.toISOString());
  const [max, setMax] = useState(day.end.toISOString());
  const [daysSuggestions, setDaysSuggestions] = useState([]);

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

  function getDaysSuggestions() {
    let results = suggestions.filter((suggestion) => {
      if (dayjs(suggestion.start).isBetween(day.start, day.end)) {
        return true;
      }
      return false;
    });

    setDaysSuggestions(results);
  }

  //Component load-in...
  useLayoutEffect(() => {
    try {
      setMin(day.start.toISOString());
      setMax(day.end.toISOString());
      getEvents();
      if (suggestions.length > 0) {
        getDaysSuggestions();
      }
    } catch (err) {
      console.debug(err);
    }
  }, []);

  //Component load-in...
  useLayoutEffect(() => {
    try {
      setMin(day.start.toISOString());
      setMax(day.end.toISOString());
      getEvents();
      if (suggestions.length > 0) {
        getDaysSuggestions();
      }
    } catch (err) {
      console.debug(err);
    }
  }, [day]);

  useLayoutEffect(() => {
    getDaysSuggestions();
  }, [suggestions]);

  return (
    <div
      className="day"
      style={{
        gridTemplateRows: timeRows,
        gridColumn: `${index + 2} / span 1`,
        gridRow: "2 / span 1",
      }}
    >
      <h3 className="dateTimeHeader" title={day.start.toISOString()}>
        {day.start.format("dddd, MMM D, 'YY")}
      </h3>
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
            type="event"
          />
        ))
      )}

      {suggestions.length === 0 ? (
        <></>
      ) : (
        daysSuggestions.map((suggestion, index) => (
          <TimeBlock
            className="event"
            key={`TBS${index}`}
            start={dayjs(suggestion.start)}
            end={dayjs(suggestion.end)}
            summary={suggestion.summary}
            dayStart={dayStart}
            type="suggestion"
          />
        ))
      )}
    </div>
  );
}

export default Day;
