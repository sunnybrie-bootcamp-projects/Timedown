import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import * as ApiClient from "../ApiClient";

function Account({ tab, setLoggedIn, gcal, user, setUser }) {
  const [editSettings, setEditSettings] = React.useState(false);

  useEffect(() => {}, [editSettings]);
  return (
    <div
      className="AccountPanel"
      style={{ display: tab === "account" ? "block" : "none" }}
    >
      <h2>Logged in as...</h2>
      <img
        id="profilePic"
        alt="profile photo"
        src={user.google.getImageUrl()}
      />
      <h3> {user.name} </h3>
      <button
        onClick={() => {
          gcal.handleSignoutClick();
          setLoggedIn(false);
          setUser({});
        }}
      >
        Log out
      </button>
      <button onClick={() => setEditSettings(true)}>Edit Settings</button>
      {editSettings ? (
        <UserSettingsForm
          {...{
            user,
            setEditSettings,
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

function UserSettingsForm({ user, setEditSettings }) {
  const [formJSX, setFormJSX] = React.useState(<></>);
  const [formReady, setFormReady] = React.useState(false);
  //manages changes to user's settings
  const [userSettings, settingsDispatch] = React.useReducer(
    settingsReducer,
    {},
  );
  //Tracks the blackOuts in the user's form
  const [tracker, trackerDispatch] = React.useReducer(trackerReducer, {
    mon: [{ start: "00:00", end: "00:00" }],
    tue: [{ start: "00:00", end: "00:00" }],
    wed: [{ start: "00:00", end: "00:00" }],
    thu: [{ start: "00:00", end: "00:00" }],
    fri: [{ start: "00:00", end: "00:00" }],
    sat: [{ start: "00:00", end: "00:00" }],
    sun: [{ start: "00:00", end: "00:00" }],
    misc: [{ start: "", end: "" }],
  });

  //user's settings pre-edited
  const [initialSettings, setInitialSettings] = React.useState({
    pushNotifications: user.timedown.pushNotifications,
    emailNotifications: user.timedown.emailNotifications,
    addToGoogleCal: user.timedown.pushNotifications,
    awakeTimeStart: user.timedown.awakeTime.start,
    awakeTimeEnd: user.timedown.awakeTime.end,
    weeklyBlackOuts: user.timedown.weeklyBlackOuts,
    miscBlackOuts: user.timedown.miscBlackOuts,
    eventBuffer: user.timedown.eventBuffer,
  });

  const [initialTracker, setInitialTracker] = React.useState({
    mon: [{ start: "00:00", end: "00:00" }],
    tue: [{ start: "00:00", end: "00:00" }],
    wed: [{ start: "00:00", end: "00:00" }],
    thu: [{ start: "00:00", end: "00:00" }],
    fri: [{ start: "00:00", end: "00:00" }],
    sat: [{ start: "00:00", end: "00:00" }],
    sun: [{ start: "00:00", end: "00:00" }],
    misc: [{ start: "", end: "" }],
  });

  function settingsReducer(userSettings, action) {
    switch (action.type) {
      case "editSummary":
        return { ...userSettings, summary: action.value };

      case "editDescription":
        return { ...userSettings, description: action.value };

      case "editEventBufferHours":
        return { ...userSettings, eventBuffferHours: action.value };

      case "editEventBufferMinutes":
        return { ...userSettings, eventBuffferMinutes: action.value };

      case "editAwakeTimeStart":
        return { ...userSettings, awakeTimeStart: action.value };

      case "editAwakeTimeEnd":
        return { ...userSettings, awakeTimeEnd: action.value };

      case "editWeeklyBlackOuts":
        return { ...userSettings, weeklyBlackOuts: action.value };

      case "editMiscBlackOuts":
        return { ...userSettings, miscBlackOuts: action.value };

      case "wipe":
        return { ...initialSettings };
      default:
        return userSettings;
    }
  }

  //Manages blackOut inputs
  function trackerReducer(tracker, action) {
    //action : {day: , type: , value: , index: , edge: start || end}
    let { day, index, edge, value } = action;
    switch (action.type) {
      case "remove":
        let downsizedArr = [];
        tracker[day].forEach((time, i) => {
          if (i !== index) {
            downsizedArr.push(time);
          }
        });
        return { ...tracker, [day]: downsizedArr };

      case "add":
        let upsizedArr = tracker[day];
        upsizedArr.push(value);

        return { ...tracker, [day]: upsizedArr };

      case "modify":
        let modifiedArr = tracker[day];
        modifiedArr[index][edge] = value;
        return { ...tracker, [day]: modifiedArr };

      case "wipe":
        return value;
      default:
        return tracker;
    }
  }

  //Renders blackOut inputs
  function getInputs(dayArr, dayString, dayKey) {
    return dayArr.map((time, index) => {
      return (
        <>
          <label key={`${dayKey}SL${index}`} htmlFor={`in-${dayString}Start`}>
            Start:
          </label>
          <input
            id={`in-${dayString}Start`}
            key={`${dayKey}SI${index}`}
            type={dayKey === "X" ? "dateTime-local" : "time"}
            value={dayArr[index].start}
            onChange={(e) => {
              trackerDispatch({
                type: `edit`,
                day: `${dayString}`,
                [index]: index,
                edge: `start`,
                value: e.target.value,
              });
            }}
          />
          <label key={`${dayKey}EL${index}`} htmlFor={`in-${dayString}End`}>
            End:
          </label>
          <input
            id={`in-${dayString}End`}
            key={`${dayKey}EI${index}`}
            type={dayKey === "X" ? "dateTime-local" : "time"}
            value={dayArr[index].end}
            onChange={(e) => {
              trackerDispatch({
                type: `edit`,
                day: `${dayString}`,
                [index]: index,
                edge: `end`,
                value: e.target.value,
              });
            }}
          />
          <button
            key={`${dayKey}D${index}`}
            value="remove"
            onClick={(e) => {
              trackerDispatch({
                type: `delete`,
                day: `${dayString}`,
                [index]: index,
                edge: `end`,
                value: e.target.value,
              });
            }}
          >
            Remove
          </button>
        </>
      );
    });
  }

  //builds jsx form to be rendered
  function getFormJSX() {
    return (
      <form className="userSettingsForm" id="settingsSubmission">
        <label htmlFor="in-pushNotifications">Push Notifications:</label>
        <input
          id="in-pushNotifications"
          type="checkbox"
          value={userSettings.summary}
          onChange={(e) => {
            settingsDispatch({
              type: "editPushNotifications",
              value: e.target.value,
            });
          }}
        />
        <label htmlFor="in-addToGoogleCal">
          Add task times to Google Calendar:
        </label>
        <input
          id="in-addToGoogleCal"
          value={userSettings.description}
          type="checkbox"
          onChange={(e) => {
            settingsDispatch({
              type: "editAddToGoogleCal",
              value: e.target.value,
            });
          }}
        />
        <h4>Scheduling</h4>
        <fieldset>
          <legend>Event Buffer Time</legend>
          <label htmlFor="in-eventBufferHours">Hours:</label>
          <input
            id="in-eventBufferHours"
            type="number"
            min="0"
            maxLength="3"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editEventBufferHours",
                value: e.target.value,
              });
            }}
          />
          <label htmlFor="in-eventBufferMinutes">Minutes:</label>
          <input
            id="in-eventBufferMinutes"
            type="number"
            step="5"
            min="0"
            max="55"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editEventBufferMinutes",
                value: e.target.value,
              });
            }}
          />
        </fieldset>
        <fieldset>
          <legend>Awake Time</legend>
          <label htmlFor="in-awakeTimeStart">Start:</label>
          <input
            id="in-awakeTimeStart"
            type="time"
            value={userSettings.awakeTimeStart}
            onChange={(e) => {
              settingsDispatch({
                type: "editAwakeTimeStart",
                value: e.target.value,
              });
            }}
          />
          <label htmlFor="in-awakeTimeEnd">End:</label>
          <input
            id="in-awakeTimeEnd"
            type="time"
            value={userSettings.awakeTimeEnd}
            onChange={(e) => {
              settingsDispatch({
                type: "editAwakeTimeEnd",
                value: e.target.value,
              });
            }}
          />
        </fieldset>
        <fieldset>
          <legend>Weekly Scheduling</legend>
          <fieldset key={`0F`}>
            <legend key={`0L`}>Monday:</legend>
            {getInputs(tracker.mon, "mon", 0)}
            <button
              key={`0A`}
              value="add"
              onClick={() => {
                trackerDispatch({
                  type: "add",
                  day: "mon",
                  value: { start: "00:00", end: "00:00" },
                });
              }}
            >
              Add
            </button>
          </fieldset>

          <fieldset>
            <legend>Tuesday:</legend>
            {getInputs(tracker.tue, "tue", 1)}
            <button
              key={`0A`}
              value="add"
              onClick={() => {
                trackerDispatch({
                  type: "add",
                  day: "tue",
                  value: { start: "00:00", end: "00:00" },
                });
              }}
            >
              Add
            </button>
          </fieldset>
          <fieldset>
            <legend>Wednesday:</legend>
            {getInputs(tracker.wed, "wed", 2)}
            <button
              key={`0A`}
              value="add"
              onClick={() => {
                trackerDispatch({
                  type: "add",
                  day: "wed",
                  value: { start: "00:00", end: "00:00" },
                });
              }}
            >
              Add
            </button>
          </fieldset>
          <fieldset>
            <legend>Thursday:</legend>
            {getInputs(tracker.thu, "thu", 3)}
            <button
              key={`0A`}
              value="add"
              onClick={() => {
                trackerDispatch({
                  type: "add",
                  day: "thu",
                  value: { start: "00:00", end: "00:00" },
                });
              }}
            >
              Add
            </button>
          </fieldset>
          <fieldset>
            <legend>Friday:</legend>
            {getInputs(tracker.fri, "fri", 4)}
            <button
              key={`0A`}
              value="add"
              onClick={() => {
                trackerDispatch({
                  type: "add",
                  day: "fri",
                  value: { start: "00:00", end: "00:00" },
                });
              }}
            >
              Add
            </button>
          </fieldset>
          <fieldset>
            <legend>Saturday:</legend>
            {getInputs(tracker.sat, "sat", 5)}
            <button
              key={`0A`}
              value="add"
              onClick={() => {
                trackerDispatch({
                  type: "add",
                  day: "sat",
                  value: { start: "00:00", end: "00:00" },
                });
              }}
            >
              Add
            </button>
          </fieldset>
          <fieldset>
            <legend>Sunday:</legend>
            {getInputs(tracker.sun, "sun", 6)}
            <button
              key={`0A`}
              value="add"
              onClick={() => {
                trackerDispatch({
                  type: "add",
                  day: "sun",
                  value: { start: "00:00", end: "00:00" },
                });
              }}
            >
              Add
            </button>
          </fieldset>
        </fieldset>
        <fieldset>
          <legend>Miscellaneous</legend>
          {getInputs(tracker.misc, "misc", "X")}
          <button
            key={`0A`}
            value="add"
            onClick={() => {
              trackerDispatch({
                type: "add",
                day: "misc",
                value: {
                  start: dayjs().toISOString(),
                  end: dayjs().toISOString(),
                },
              });
            }}
          >
            Add
          </button>
        </fieldset>
      </form>
    );
  }
  // const onSubmitForm = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await ApiClient.addTask(
  //       user.timedown.id,
  //       userSettings.dueDate,
  //       userSettings.estTimeHours,
  //       userSettings.estTimeMinutes,
  //       userSettings.summary,
  //       userSettings.description,
  //     );

  //     const update = JSON.stringify(response);
  //     window.alert("Task submitted!");

  //     const data = JSON.parse(update);

  //     //getTasksInfo();

  //     settingsDispatch({ type: "wipe", value: { initialSettings } });
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  React.useEffect(() => {
    setInitialTracker(
      initialSettings.weeklyBlackOuts
        ? {
            ...initialSettings.weeklyBlackOuts,
            misc: initialSettings.miscBlackOuts
              ? initialSettings.miscBlackOuts
              : { start: "", end: "" },
          }
        : {
            ...initialTracker,
          },
    );
  }, []);

  React.useEffect(() => {
    trackerDispatch({ type: `wipe`, value: initialTracker });
  }, [initialTracker]);

  React.useEffect(() => {
    setFormJSX(() => getFormJSX());
    setFormReady(true);
  }, [tracker]);

  if (formReady) {
    return <>{formJSX}</>;
  } else {
    return <p>Loading settings...</p>;
  }
}

export default Account;
