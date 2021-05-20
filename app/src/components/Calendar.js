import React, { useState, useEffect, StrictMode, useLayoutEffect } from "react";

import dayjs from "dayjs";

import Day from "./Day";
import { CalendarNavBar } from "./NavBar";
import TimeLine from "./TimeLine";

//dayjs plugins
const AdvancedFormat = require("dayjs/plugin/advancedFormat");
const duration = require("dayjs/plugin/duration");
const isBetween = require("dayjs/plugin/isBetween");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(AdvancedFormat);
dayjs.extend(duration);
dayjs.extend(isBetween);

function Calendar({ isAuthenticated, tab, gcal, user, suggestions }) {
  const [isReady, setIsReady] = useState(false);
  //Number of days the user wants to see
  const [calView, setCalView] = useState("1day");
  //Starting hour for day rendering
  const [dayStart, setDayStart] = useState(dayjs.duration({ hours: 0 }));
  //Ending hour for day rendering
  const [dayEnd, setDayEnd] = useState(dayjs.duration({ hours: 23 }));
  //Total hours rendered in a day
  const [totalHours, setTotalHours] = useState(24);
  //Days to be displayed in calendar
  const [days, setDays] = useState([
    { start: dayjs().set("hour", 0), end: dayjs().set("hour", 23) },
  ]);
  // Adjust days state when user clicks "previous" or "next" in navigation
  const [dateNavigation, setDateNavigation] = useState(0);
  //Sets Calendar's columns based on calView
  const [dayColumns, setDayColumns] = useState("1fr 4fr");
  //Sets the rows for TimeLine and Day components, based on total hours
  const [timeRows, setTimeRows] = useState("");

  //sets dayStart, dayEnd, and totalHours states for rendering
  function setTimeRanges() {
    if (user.timedown.awakeTime) {
      //^([01]\d|2[0-3]):?([0-5]\d)$ //regex time
      let startArr = user.timedown.awakeTime.start.split(":");
      let startObj = {
        hours: parseInt(startArr[0]),
        minutes: parseInt(startArr[1]),
      };
      let start = dayjs.duration(startObj);

      let endArr = user.timedown.awakeTime.end.split(":");
      let endObj = { hours: parseInt(endArr[0]), minutes: parseInt(endArr[1]) };
      let end = dayjs.duration(endObj);

      setDayStart(start);
      setDayEnd(end);

      let total = end.hours() - start.hours();
      // console.debug({ total }); //TEST
      setTotalHours(total);
    }
  }

  //generates string for timeRows state
  function timeToRows(total) {
    let template = ["2.5fr"];
    let size = 100 / (total * 4);
    for (let i = 0; i < total; i += 0.25) {
      template.push(`1fr`);
    }
    setTimeRows(template.join(" "));
  }

  //gets the days to render based on calView uption, sets days state
  function getDates(num) {
    let newDates = [];
    for (let i = 0; i < num; i++) {
      //set starting time
      let newStart = dayjs();
      newStart = newStart.set("hour", dayStart.hours());
      newStart = newStart.set(
        "minute",
        dayStart.minutes() ? dayStart.minutes() : 0,
      );
      newStart = newStart.add(i, "day"); //set day

      //set ending time
      let newEnd = newStart;
      newEnd = newEnd.set("hour", dayEnd.hours());
      newEnd = newEnd.set("minute", dayEnd.minutes() ? dayEnd.minutes() : 0);
      if (newEnd.isBefore(newStart)) {
        newEnd = newEnd.add(1, "day"); //set day
      }

      if (dateNavigation < 0) {
        newStart = newStart.subtract(
          dayjs.duration({ days: Math.abs(dateNavigation) }),
        );
        newEnd = newEnd.subtract(
          dayjs.duration({ days: Math.abs(dateNavigation) }),
        );
      } else if (dateNavigation > 0) {
        newStart = newStart.add(Math.abs(dateNavigation), "days");
        newEnd = newEnd.add(dayjs.duration({ days: Math.abs(dateNavigation) })); //set day
      }
      newDates.push({ start: newStart, end: newEnd });
    }

    setDays(newDates);

    let newDayColumns =
      newDates.length === 1
        ? "1fr 9fr"
        : "1fr".concat(
            newDates
              .map((date, index) => {
                return " 2fr";
              })
              .join(""),
          );

    setDayColumns(newDayColumns);
  }

  //reads calView and updays states
  function getView() {
    switch (calView) {
      case "1day":
        return 1;
      case "3day":
        return 3;
      case "week":
        return 7;
      default:
        return 1;
    }
  }

  //USE EFFECTS

  useLayoutEffect(() => {
    try {
      setTimeRanges();
      timeToRows(totalHours);
    } catch (err) {
      window.alert(err);
    }
    try {
      getDates(getView());
    } catch (err) {
      window.alert(err);
    }
    try {
      setIsReady(true);
    } catch (err) {
      window.alert(err);
    }
  }, []);

  useLayoutEffect(() => {
    try {
      setDays([]);
      getDates(getView());
    } catch (err) {
      window.alert(err);
    }
  }, [calView, dateNavigation]);

  if (isReady) {
    return (
      <div
        className="calendar"
        style={{
          display: tab === "calendar" ? "grid" : "none",
          gridTemplateColumns: dayColumns,
        }}
      >
        <CalendarNavBar
          {...{ calView, setCalView, dateNavigation, setDateNavigation }}
        />
        <TimeLine {...{ timeRows, isAuthenticated, totalHours, dayStart }} />
        {days.map((day, index) => {
          return (
            <Day
              key={`D${index}`}
              {...{
                index,
                timeRows,
                isAuthenticated,
                gcal,
                day,
                dayStart,
                suggestions,
                calView,
              }}
            />
          );
        })}
      </div>
    );
  } else {
    return <p className="loadingMessage">Loading calendar...</p>;
  }
}

export default Calendar;
