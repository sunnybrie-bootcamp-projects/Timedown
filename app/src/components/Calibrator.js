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

const Calibrator = ({
  gcal,
  user,
  dayStart,
  dayEnd,
  details,
  suggestions,
  setSuggestions,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [estTime, setEstTime] = useState(dayjs.duration(details.estTime));

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [timeRemaining, setTimeRemaining] = useState(""); //remaining time between now and duedate
  const [freeTimesRemaining, setFreeTimesRemaining] = useState([]); //remaining available time between now and due date
  const [totalFreeTime, setTotalFreeTime] = useState(dayjs.duration(0)); //sum total of free times remaining
  const [taskPriority, setTaskPriority] = useState(0);

  //user's settings
  const awakeTime = { start: dayStart, end: dayEnd };
  const eventBuffer = dayjs.duration({
    ...user.timedown.eventBuffer,
    hours: 0,
  });

  //time remaining
  function getRemainingTime(dueDate) {
    return dayjs(dueDate).fromNow();
  }
  async function addToGoogleCal(eventsArr) {
    //{"kind":"calendar#event","etag":"\"3243224849178000\"","id":"5f8acg1mhfb5263cchonigpuki_20210521T160000Z","status":"confirmed","htmlLink":"https://www.google.com/calendar/event?eid=NWY4YWNnMW1oZmI1MjYzY2Nob25pZ3B1a2lfMjAyMTA1MjFUMTYwMDAwWiBicmllbm5hLmtsYXNzZW5AbQ&ctz=America/Los_Angeles","created":"2021-01-24T22:41:30.000Z","updated":"2021-05-21T15:53:44.589Z","summary":"Techtonica: Daily Morning Stand-Up","description":"Techtonica Org is inviting you to a scheduled Zoom meeting.\n\nJoin Zoom Meeting\nhttps://zoom.us/j/93737314088?pwd=RXhvYTUrREJiQ2c1MDgwVGF0NDRKZz09\n\nMeeting ID: 937 3731 4088\nPasscode: 00000001\nOne tap mobile\n+16699009128,,93737314088#,,,,*00000001# US (San Jose)\n+12532158782,,93737314088#,,,,*00000001# US (Tacoma)\n\nDial by your location\n        +1 669 900 9128 US (San Jose)\n        +1 253 215 8782 US (Tacoma)\n        +1 346 248 7799 US (Houston)\n        +1 312 626 6799 US (Chicago)\n        +1 646 558 8656 US (New York)\n        +1 301 715 8592 US (Washington DC)\nMeeting ID: 937 3731 4088\nPasscode: 00000001\nFind your local number: https://zoom.us/u/abOHP0Ldi9","location":"https://zoom.us/j/93737314088?pwd=RXhvYTUrREJiQ2c1MDgwVGF0NDRKZz09","creator":{"email":"nquinones@techtonica.org"},"organizer":{"email":"c_j5d3c22o6nod523b02gatphkos@group.calendar.google.com","displayName":"Techtonica events"},"start":{"dateTime":"2021-05-21T09:00:00-07:00"},"end":{"dateTime":"2021-05-21T09:30:00-07:00"},"recurringEventId":"5f8acg1mhfb5263cchonigpuki_R20210510T160000","originalStartTime":{"dateTime":"2021-05-21T09:00:00-07:00"},"iCalUID":"5f8acg1mhfb5263cchonigpuki_R20210510T160000@google.com","sequence":1,"attendees":[{"email":"adilene.valencias@gmail.com","responseStatus":"declined"},{"email":"jewangyj@gmail.com","responseStatus":"accepted"},{"email":"abigail.edwards317@gmail.com","responseStatus":"accepted"},{"email":"taela.luccia@gmail.com","responseStatus":"accepted"},{"email":"leiaquesada@gmail.com","responseStatus":"accepted"},{"email":"michelleglauser@techtonica.org","responseStatus":"declined"},{"email":"sophiarafat@icloud.com","responseStatus":"needsAction"},{"email":"brienna.klassen@gmail.com","self":true,"responseStatus":"accepted"},{"email":"me@averymiller.me","responseStatus":"accepted"},{"email":"meianatividad@gmail.com","responseStatus":"accepted"},{"email":"mandychen.art@gmail.com","responseStatus":"accepted"},{"email":"a.lukinicheva@gmail.com","responseStatus":"accepted"},{"email":"scawley@techtonica.org","responseStatus":"declined"},{"email":"crodriguez@techtonica.org","responseStatus":"accepted"}],"reminders":{"useDefault":true},"eventType":"default"}
    try {
      let additions = eventsArr.map(async (suggestion) => {
        return await gcal.createEvent(
          JSON.stringify({
            resource: {
              summary: suggestion.summary,
              location: "",
              description: details.description,
              start: {
                dateTime: dayjs(suggestion.start).toISOString(),
                timeZone: "America/Los_Angeles",
              },
              end: {
                dateTime: dayjs(suggestion.end).toISOString(),
                timeZone: "America/Los_Angeles",
              },
              colorId: 1,
            },
            calendarId: "primary",
            sendUpdates: "none",
          }),
        );
      });

      await Promise.all(additions);

      window.alert("Successfully added to your Google calendar");
    } catch (err) {
      window.alert("ERROR: ", "Failed to add to your Google calendar.");
    }
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
      let start = dayjs(freeTime.start);
      let end = dayjs(freeTime.end);

      if (end.isBefore(start)) {
        return null;
      }

      let range = {
        min: start
          .hour(awakeTime.start.hours())
          .minute(awakeTime.start.minutes()),
        max: start.hour(awakeTime.end.hours()).minute(awakeTime.end.minutes()),
      };

      let early = start.isBefore(range.min);
      let late = end.isAfter(range.max);

      //console.debug({ range }, { early }, { late });

      //if out of range, drop this time
      //if early/late, adjust time
      if (early && late) {
        return null;
      } else if (early) {
        start = range.min;
      } else if (late) {
        end = range.max;
      }

      let ftDuration = dayjs.duration(end.diff(start));
      let minDuration = eventBuffer;

      if (ftDuration.asMilliseconds() < minDuration.asMilliseconds()) {
        return null;
      }

      return {
        ...freeTime,
        start: start.toISOString(),
        end: end.toISOString(),
        duration: ftDuration,
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

    return dayjs.duration(total);
  }

  //get proportion of each free time block
  function getFreeTimePercentages(total, freeTimeArr) {
    let update = freeTimeArr.map((freeTime) => {
      let freeTimePercentage = parseFloat(
        freeTime.duration.asMilliseconds() / total.asMilliseconds(),
      );

      return { ...freeTime, freeTimePercentage };
    });

    return update;
  }

  //get suggested time spent working on task
  function getSuggestions() {
    let totals = freeTimesRemaining.map((freeTime) => {
      let amount =
        freeTime.freeTimePercentage *
        dayjs.duration(details.estTime).asMilliseconds();
      let timeWindow = dayjs
        .duration(dayjs(freeTime.end).diff(dayjs(freeTime.start)))
        .asMilliseconds();
      if (amount < dayjs.duration({ minutes: 15 }).asMilliseconds()) {
        amount = dayjs.duration({ minutes: 15 }).asMilliseconds();
      }
      if (amount > timeWindow) {
        amount = timeWindow;
      }

      let item = {
        amount: dayjs.duration(amount),
        start: freeTime.start,
        end: dayjs(freeTime.start).add(amount).toISOString(),
        summary: details.summary,
      };

      return item;
    });

    totals = totals.filter((freeTime) => {
      if (
        freeTime.amount.asMilliseconds() <
        dayjs.duration({ minutes: 15 }).asMilliseconds()
      ) {
        return false;
      } else {
        return true;
      }
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
        return getRemainingFreeTimes(d);
      })(details.dueDate)
        .then((results) => {
          getRemainingTime(details.dueDate, currentDate);
          return filterRemainingFreeTimes(results);
        })
        .then((results) => {
          setTimeRemaining(results[0]);
          setTotalFreeTime(getSumFreeTime(results));
          return [getSumFreeTime(results), results];
        })
        .then((results) => {
          return getFreeTimePercentages(results[0], results[1]);
        })
        .then((results) => {
          setFreeTimesRemaining(results);
        });
    } catch (err) {
      console.debug("Error: ", err);
    }
  }, []);

  useEffect(() => {
    getSuggestions();
    setIsReady(true);
  }, [freeTimesRemaining.length]);

  if (isReady) {
    return (
      <div className="calibrator">
        {checkAchievability() === true ? (
          <>
            <div className="detailsHeader">
              <p>
                You should compete your task by{" "}
                {dayjs(details.dueDate).format("dddd, MMM D, YYYY h:mm A")} if
                you follow this plan.
              </p>
              <button onClick={() => addToGoogleCal(suggestions)}>
                Add to Google Calendar
              </button>
            </div>
            <br />
            <div className="detailsBody">
              <table className="suggestionsTable">
                <caption>Suggestions:</caption>
                <thead>
                  <tr>
                    <th>Starting</th>
                    <th>For</th>
                    <th>Until</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map((time, index) => {
                    let when = dayjs(freeTimesRemaining[index].start).format(
                      `ddd, M/D/YY
                  h:mma`,
                    );
                    let until = dayjs(freeTimesRemaining[index].start)
                      .add(time.amount)
                      .format(`h:mm a`);
                    let howLong = time.amount.humanize();
                    return (
                      <tr className="suggestion">
                        <td>
                          <p>{`${when}`}</p>
                        </td>
                        <td>
                          <p>{`${howLong}`}</p>
                        </td>
                        <td>
                          <p>{`${until}`}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>{" "}
            </div>
          </>
        ) : (
          <p>
            It looks like you don't have enough spare time to complete this task
            by {dayjs(details.dueDate).format("dddd, MMM D, YYYY h:mm A")}.
            According to the Calibrator, you're short on free time for this task
            by approximately: {checkAchievability().humanize()}
          </p>
        )}
      </div>
    );
  } else {
    return <p className="loadingMessage">Calculating...</p>;
  }
};

export default Calibrator;
