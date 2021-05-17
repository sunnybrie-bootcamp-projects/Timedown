import React, { useState, useEffect } from "react";

import dayjs from "dayjs";

import * as dbRequest from "../dbRequest";

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

  const [currentDate, setCurrentDate] = React.useState(dayjs());
  const [timeRemaining, setTimeRemaining] = React.useState(""); //remaining time between now and duedate
  const [freeTimesRemaining, setFreeTimesRemaining] = React.useState([]); //remaining available time between now and due date
  const [totalFreeTime, setTotalFreeTime] = React.useState(dayjs.duration(0)); //sum total of free times remaining
  const [taskPriority, setTaskPriority] = React.useState(0);

  //user's settings
  const awakeTime = user.timedown.sleepTime;
  const eventBuffer = dayjs.duration({
    ...user.timedown.eventBuffer,
    hours: 0,
  });

  //time remaining
  function getRemainingTime(dueDate, currentDate) {
    return dayjs(dueDate).fromNow();
  }

  //free time remaining
  async function getRemainingFreeTimes(dueDate, currentDate) {
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

    /*
      .then(function (freeTimes) {
        //filter windows based on user settings
        //filter out times that don't fit in user's sleep settings
        freeTimes = freeTimes.filter((freeTime) => {
          let range = {
            min: dayjs(freeTime.start)
              .hour(awakeTime.start.hours)
              .minute(awakeTime.start.minutes),
            max: dayjs(freeTime.end)
              .hour(awakeTime.end.hours)
              .minute(awakeTime.end.minutes),
          };

          let early = dayjs(freeTime.start).isBefore(range.start);
          let late = dayjs(freeTime.end).isAfter(range.end);
          let outOfRange = early && late;

          //if out of range, drop this time
          //if early/late, adjust time
          if (outOfRange) {
            return false;
          } else if (early) {
            freeTime.start = range.start;
          } else if (late) {
            freeTime.end = range.end;
          }

          let ftDuration = dayjs.duration(
            dayjs(freeTime.start).diff(dayjs(freeTime.end)),
          );
          let minDuration = dayjs.duration(eventBuffer);

          if (ftDuration < minDuration) {
            return false;
          } else {
            freeTime.duration = ftDuration;
          }

          return true;
        });

        return freeTimes;
      })
    */

    console.debug(await timeBlocks);

    setFreeTimesRemaining(await timeBlocks);
  }

  //filters out free times based on user settings
  async function filterRemainingFreeTimes() {
    console.debug("filtering...");
    console.debug(freeTimesRemaining);

    //filter windows based on user settings
    //filter out times that don't fit in user's sleep settings
    let count = 0;
    const filteredTimeBlocks = freeTimesRemaining.map((freeTime) => {
      count++;
      console.debug("ROUND ", count, ": ", freeTime);

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

      console.debug({ range }, { early }, { late });

      //if out of range, drop this time
      //if early/late, adjust time
      if (early && late) {
        return null;
      } else if (early) {
        freeTime.start = range.min;
      } else if (late) {
        freeTime.end = range.max;
      }

      let ftDuration = dayjs.duration(freeTime.start.diff(freeTime.end));
      let minDuration = dayjs.duration(eventBuffer);

      if (ftDuration < minDuration) {
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

    console.debug(typeof filteredTimeBlocks, { filteredTimeBlocks });
    console.debug(typeof (await filteredTimeBlocks), await filteredTimeBlocks);
  }

  //reduce free times to total free time
  function getSumFreeTime() {
    //console.debug("getSumFreeTime()"); //Test

    function getMilliseconds(total, current) {
      let addedTime = current.totalTime < 0 ? 0 : current.totalTime;
      return total + addedTime;
    }

    let msHours = 1000 * 60 * 60;
    let msMinutes = 1000 * 60;

    let totalMS = freeTimesRemaining.reduce(getMilliseconds, 0);
    let hours = totalMS / msHours;
    let minutes = (totalMS % msHours) / msMinutes;

    setTotalFreeTime({ totalMS: totalMS, hours: hours, minutes: minutes });
  }

  //get proportion of each free time block
  function getFreeTimePercentages() {
    let update = freeTimesRemaining.map((freetime) => {
      freetime.freeTimePercentage =
        parseInt(freetime.totalTime) / totalFreeTime.totalMS;
      return freetime;
    });

    setFreeTimesRemaining(update);

    getSuggestions();
  }

  //get suggested time spent working on task
  function getSuggestions() {
    let task_hoursToMS = testTask.estTime.hours * 60 * 60 * 1000;
    let msHours = 1000 * 60 * 60;
    let msMinutes = 1000 * 60;

    let totals = freeTimesRemaining.map((time) => {
      let amount = time.freeTimePercentage * task_hoursToMS;
      let hours = Math.round(amount / msHours);
      let minutes = Math.round((amount % msHours) / msMinutes);

      return { totalMS: amount, hours, minutes };
    });

    setSuggestions(totals);
  }

  //USE EFFECTS
  //When component mounts, gets array of free timeblocks and total remaining time until due date
  React.useEffect(async () => {
    getRemainingFreeTimes(testTask.dueDate, currentDate);
    setTimeRemaining(getRemainingTime(testTask.dueDate, currentDate));
  }, []);

  //When length of freeTimesRemaining changes (aka they've loaded in)
  //Gets sum of all free time
  React.useEffect(() => {
    if (
      freeTimesRemaining.length > 0 &&
      freeTimesRemaining[freeTimesRemaining.length - 1].end
    ) {
      try {
        //getSumFreeTime();
        filterRemainingFreeTimes();
      } catch (err) {
        console.debug("Error: ", err);
      }
    }
  }, [freeTimesRemaining.length]);

  //when total free time is calculated, calculates percentages
  React.useEffect(() => {
    // if (totalFreeTime !== {}) {
    //   try {
    //     getFreeTimePercentages();
    //   } catch (err) {
    //     console.debug("Error: ", err);
    //   }
    // }
  }, [totalFreeTime]);

  return (
    <div className="calibrator">
      <h4>Suggestions:</h4>
      <ol>
        {suggestions.map((time, index) => {
          let freeTime = dayjs(freeTimesRemaining[index].start.dateTime).format(
            "ddd, MMM D, YYYY h:mm A",
          );
          let duration =
            time.totalMS >= 0
              ? `For: ${time.hours}hrs : ${time.minutes}min`
              : "Don't work at this time.";
          return (
            <li>
              <span className="when">{`When: ${freeTime}`}</span>
              <span className="duration">{`${duration}`}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Calibrator;
