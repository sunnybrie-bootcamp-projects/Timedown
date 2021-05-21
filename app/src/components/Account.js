import React, { useEffect, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

import dayjs from "dayjs";

import * as ApiClient from "../ApiClient";

const initialTrackerState = {
  mon: [{ start: "", end: "" }],
  tue: [{ start: "", end: "" }],
  wed: [{ start: "", end: "" }],
  thu: [{ start: "", end: "" }],
  fri: [{ start: "", end: "" }],
  sat: [{ start: "", end: "" }],
  sun: [{ start: "", end: "" }],
  misc: [{ start: "", end: "" }],
};

function Account({ tab, setLoggedIn, gcal, user, setUser }) {
  const [editSettings, setEditSettings] = React.useState(false);

  useEffect(() => {}, [editSettings]);
  return (
    <div
      className="accountPanel"
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
  //manages changes to user's settings
  const [userSettings, settingsDispatch] = React.useReducer(
    settingsReducer,
    {},
  );

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
      <fieldset key="EBF">
        <legend key="EBL">Event Buffer Time</legend>
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
      <fieldset key="ATF">
        <legend key="ATL">Awake Time</legend>
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
      <fieldset key="WSF">
        <legend key="WSL">Weekly Scheduling</legend>
        <fieldset key={`0F`}>
          <legend key={`0L`}>Monday:</legend>
          <DayInputs
            key={`DI0`}
            dayArr={tracker.mon}
            dayString="mon"
            dayIndex={0}
            {...{ trackerDispatch }}
          />
          <button
            type="button"
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
          <DayInputs
            key={`DI1`}
            dayArr={tracker.tue}
            dayString="tue"
            dayIndex={1}
            {...{ trackerDispatch }}
          />
          <button
            type="button"
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
          <DayInputs
            key={`DI2`}
            dayArr={tracker.wed}
            dayString="wed"
            dayIndex={2}
            {...{ trackerDispatch }}
          />
          <button
            type="button"
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
          <DayInputs
            key={`DI3`}
            dayArr={tracker.thu}
            dayString="thu"
            dayIndex={3}
            {...{ trackerDispatch }}
          />
          <button
            type="button"
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
          <DayInputs
            key={`DI4`}
            dayArr={tracker.fri}
            dayString="fri"
            dayIndex={4}
            {...{ trackerDispatch }}
          />
          <button
            type="button"
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
          <DayInputs
            key={`DI5`}
            dayArr={tracker.sat}
            dayString="sat"
            dayIndex={5}
            {...{ trackerDispatch }}
          />
          <button
            type="button"
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
          <DayInputs
            key={`DI6`}
            dayArr={tracker.sun}
            dayString="sun"
            dayIndex={6}
            {...{ trackerDispatch }}
          />
          <button
            type="button"
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
      <fieldset key="MF">
        <legend key="ML">Miscellaneous</legend>
        <DayInputs
          key={`DIX`}
          dayArr={tracker.misc}
          dayString="misc"
          dayIndex={"X"}
          {...{ trackerDispatch }}
        />
        <button
          type="button"
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

//Renders blackOut inputs
function DayInputs({ dayArr, dayString, dayKey, trackerDispatch }) {
  //Tracks the blackOuts in the user's form
  const [tracker, trackerDispatch] = React.useReducer(
    trackerReducer,
    initialTrackerState,
  );
  const [inputsReady, setInputsReady] = useState(false);

  useLayoutEffect(() => {}, [dayArr]);

  useEffect(() => {
    setInputsReady(true);
  }, [dayArr]);

  if (inputsReady) {
    return (
      <React.Fragment>
        {dayArr.map((time, index) => {
          return (
            <BlackOutInput
              key={`BOI${dayKey}${index}`}
              {...{
                dayKey,
                dayString,
                dayArr,
                index,
                trackerDispatch,
              }}
            />
          );
        })}
      </React.Fragment>
    );
  } else {
    return <p className="loadingMessage">Loading inputs...</p>;
  }
}

function BlackOutInput({
  dayKey,
  dayArr,
  dayString,
  index,
  tracker,
  trackerDispatch,
}) {
  return (
    <>
      <label key={`${dayKey}SL${index}`} htmlFor={`in-${dayString}Start`}>
        Start:
      </label>
      <input
        id={`in-${dayString}Start`}
        key={`${dayKey}SI`}
        type={dayKey === "X" ? "dateTime-local" : "time"}
        value={dayArr[index].start}
        onChange={(e) => {
          trackerDispatch({
            type: `edit`,
            day: `${dayString}`,
            index: index,
            edge: `start`,
            value: e.target.value,
          });
        }}
      />
      <label key={`${dayKey}EL`} htmlFor={`in-${dayString}End`}>
        End:
      </label>
      <input
        id={`in-${dayString}End`}
        key={`${dayKey}EI`}
        type={dayKey === "X" ? "dateTime-local" : "time"}
        value={dayArr[index].end}
        onChange={(e) => {
          trackerDispatch({
            type: `edit`,
            day: `${dayString}`,
            index: index,
            edge: `end`,
            value: e.target.value,
          });
        }}
      />
      <button
        key={`${dayKey}D`}
        value="remove"
        onClick={(e) => {
          trackerDispatch({
            type: `delete`,
            day: `${dayString}`,
            index: index,
            edge: `end`,
            value: e.target.value,
          });
        }}
      >
        Remove
      </button>
    </>
  );
}

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
      return { ...userSettings };
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
      return { ...tracker, [day]: [...downsizedArr] };

    case "add":
      return { ...tracker, [day]: [...tracker[day], value] };

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
export default Account;

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
