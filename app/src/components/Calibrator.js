import React, { useState, useEffect, useLayoutEffect } from "react";

import dayjs from "dayjs";

import * as ApiClient from "../ApiClient";

//dayjs plugins
const AdvancedFormat = require("dayjs/plugin/advancedFormat");
const duration = require("dayjs/plugin/duration");
const isBetween = require("dayjs/plugin/isBetween");
const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);
dayjs.extend(AdvancedFormat);
dayjs.extend(duration);
dayjs.extend(isBetween);

const Calibrator = ({ gcal, user, details, suggestions, setSuggestions }) => {
  //dummy task
  const [testTask, setTestTask] = React.useState(details);
  const [estTime, setEstTime] = React.useState(dayjs.duration(details.estTime));

  const [currentDate, setCurrentDate] = React.useState(dayjs());
  const [timeRemaining, setTimeRemaining] = React.useState(""); //remaining time between now and duedate
  const [freeTimesRemaining, setFreeTimesRemaining] = React.useState([]); //remaining available time between now and due date
  const [totalFreeTime, setTotalFreeTime] = React.useState(dayjs.duration(0)); //sum total of free times remaining
  const [taskPriority, setTaskPriority] = React.useState(0);

  //user's settings
  const awakeTime = user.timedown.awakeTime;
  const eventBuffer = dayjs.duration({
    ...user.timedown.eventBuffer,
    hours: 0,
  });

  //time remaining
  function getRemainingTime(dueDate) {
    return dayjs(dueDate).fromNow();
  }

  //free time remaining
  async function getRemainingFreeTimes(dueDate) {
    //console.debug(`getRemainingFreeTimes(duedate, currentdate)`); //Test
    const timeBlocks = await gcal
      .listEvents({
        calendarId: "primary",
        timeMin: dayjs().toISOString(),
        timeMax: dayjs(dueDate).toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      })
      .then(async (response) => {
        //get all windows of time in between
        //All resulting events
        let busyArr = new Promise((resolve) => {
          let results = JSON.parse(response.body);
          resolve(results.items);
        })
          .then((arr) => {
            //reduces busyArr to times in between, adds times to freeArr
            let finalResults = arr.reduce(
              (freeTimes, busyTime, index, array) => {
                // let freeTimes = [];
                // for (let index = 0; index < busyArr.length - 1; index++) {
                let ft = {};
                let next = array[index + 1];

                ft.start = dayjs(busyTime.end.dateTime).toISOString();
                ft.end = array[index + 1]
                  ? dayjs(array[index + 1].start.dateTime).toISOString()
                  : dayjs(ft.start).endOf("day").toISOString();

                if (index === 0) {
                  freeTimes.push({
                    start: dayjs().toISOString(),
                    end: dayjs(busyTime.start.dateTime).toISOString(),
                  });
                }

                freeTimes.push(ft);

                return freeTimes;
                // }
              },
              [],
            );

            return finalResults;
          })
          .catch((err) => {
            console.debug("busyArr Error: ", err);
          });

        return await busyArr;
      })
      .catch((err) => {
        console.debug("ERROR: ", err);
      });

    return await timeBlocks;
  }

  //filters out free times based on user settings
  function filterRemainingFreeTimes(freeTimeArr) {
    //filter out times that don't fit in user's settings
    let filteredTimeBlocks = freeTimeArr.map((freeTime) => {
      freeTime.start = dayjs(freeTime.start);
      freeTime.end = dayjs(freeTime.end);

      if (freeTime.end.isBefore(freeTime.start)) {
        return null;
      }

      let range = {
        min: freeTime.start
          .hour(awakeTime.start.hours)
          .minute(awakeTime.start.minutes),
        max: freeTime.start
          .hour(awakeTime.end.hours)
          .minute(awakeTime.end.minutes),
      };

      let early = freeTime.start.isBefore(range.min);
      let late = freeTime.end.isAfter(range.max);

      //console.debug({ range }, { early }, { late });

      //if out of range, drop this time
      //if early/late, adjust time
      if (early && late) {
        return null;
      } else if (early) {
        freeTime.start = range.min;
      } else if (late) {
        freeTime.end = range.max;
      }

      let ftDuration = dayjs.duration(freeTime.end.diff(freeTime.start));
      let minDuration = eventBuffer;

      if (ftDuration.asMilliseconds() < minDuration.asMilliseconds()) {
        return null;
      } else {
        freeTime.duration = ftDuration;
      }

      return {
        ...freeTime,
        start: freeTime.start.toISOString(),
        end: freeTime.end.toISOString(),
      };
    });

    //removes time blocks that don't pass the above filter (they return null)
    filteredTimeBlocks = filteredTimeBlocks.filter((freeTime) => {
      if (freeTime === null) {
        return false;
      }

      return true;
    });

    return filteredTimeBlocks;
  }

  //reduce free times to total free time
  function getSumFreeTime(freeTimeArr) {
    //console.debug("getSumFreeTime()"); //Test

    let total = 0;

    freeTimeArr.forEach((freeTime) => {
      if (freeTime.duration) {
        total += freeTime.duration.asMilliseconds();
      }
    });

    setTotalFreeTime(dayjs.duration(total));
  }

  //get proportion of each free time block
  function getFreeTimePercentages(freeTimeArr) {
    let update = freeTimeArr.map((freeTime) => {
      if (freeTime.duration) {
        freeTime.freeTimePercentage =
          parseInt(freeTime.duration.asMilliseconds()) /
          totalFreeTime.asMilliseconds();
      }
      return freeTime;
    });

    return update;
  }

  //get suggested time spent working on task
  function getSuggestions() {
    let totals = freeTimesRemaining.map((freeTime) => {
      let amount = freeTime.freeTimePercentage * estTime.asMilliseconds();
      let timeWindow = dayjs(freeTime.end).diff(dayjs(freeTime.start));
      if (amount > timeWindow) {
        amount = timeWindow;
      }

      let item = {
        amount: dayjs.duration(amount),
        start: freeTime.start,
        end: dayjs(freeTime.start).add(amount).toISOString(),
        summary: testTask.summary,
      };

      return item;
    });

    setSuggestions(totals);
  }

  //checks if there is enough time left to complete task
  function checkAchievability() {
    let totalWorkTime = 0;
    suggestions.forEach((suggestion) => {
      totalWorkTime += suggestion.amount.asMilliseconds();
    });

    if (totalWorkTime < estTime.asMilliseconds()) {
      let timeNeeded = dayjs.duration(estTime.asMilliseconds() - totalWorkTime);
      return timeNeeded;
    } else {
      return true;
    }
  }

  //USE EFFECTS
  //When component mounts, gets array of free timeblocks and total remaining time until due date
  useLayoutEffect(() => {
    try {
      (async (d) => {
        return await getRemainingFreeTimes(d);
      })(testTask.dueDate).then((results) => {
        setFreeTimesRemaining(results);
      });
    } catch (err) {
      console.debug("Error: ", err);
    }
    try {
      setTimeRemaining(getRemainingTime(testTask.dueDate, currentDate));
      setFreeTimesRemaining((freeTimesRemaining) =>
        filterRemainingFreeTimes(freeTimesRemaining),
      );
      getSumFreeTime(freeTimesRemaining);
      setFreeTimesRemaining((freeTimesRemaining) =>
        getFreeTimePercentages(freeTimesRemaining),
      );
      getSuggestions();
    } catch (err) {
      console.debug("Error: ", err);
    }
  }, []);

  useEffect(() => {}, [suggestions]);

  return (
    <div className="calibrator">
      <h4>Suggestions:</h4>
      {checkAchievability() === true ? (
        <>
          <p>
            You should compete your task by{" "}
            {dayjs(testTask.dueDate).format("dddd, MMM D, YYYY h:mm A")} if you
            follow this plan.
          </p>
          <ol>
            {suggestions.map((time, index) => {
              let when = dayjs(freeTimesRemaining[index].start).format(
                "ddd, MMM D, YYYY h:mm A",
              );
              let howLong = time.amount.humanize();
              return (
                <li>
                  <span className="when">{`When: ${when}`}</span>
                  <span className="duration">{`For: ${howLong}`}</span>
                </li>
              );
            })}
          </ol>{" "}
        </>
      ) : (
        <p>
          It looks like you don't have enough spare time to complete this task
          by {dayjs(testTask.dueDate).format("dddd, MMM D, YYYY h:mm A")}.
          According to the Calibrator, you're short on free time for this task
          by approximately: {checkAchievability().humanize()}
        </p>
      )}
    </div>
  );
};

export default Calibrator;
