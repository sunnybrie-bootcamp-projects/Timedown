import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import * as ApiClient from "../ApiClient";

function Account({ tab, setLoggedIn, gcal, user, setUser }) {
  const [userSettings, settingsDispatch] = React.useReducer(
    settingsReducer,
    {},
  );
  const [editSettings, setEditSettings] = React.useState(false);

  //Empty add form
  const initialState = {
    pushNotifications: user.timedown.pushNotifications,
    emailNotifications: user.timedown.emailNotifications,
    addToGoogleCal: user.timedown.pushNotifications,
    awakeTimeStart: user.timedown.sleepTime.start,
    awakeTimeEnd: user.timedown.sleepTime.end,
    weeklyBlackOuts: user.timedown.weeklyBlackOuts,
    miscBlackOuts: user.timedown.miscBlackOuts,
    eventBuffer: user.timedown.eventBuffer,
  };

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
        return { ...userSettings, dueDate: action.value };

      case "wipe":
        return { ...initialState };
      default:
        return userSettings;
    }
  }

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
      {!editSettings ? (
        <p></p>
      ) : (
        <UserSettingsForm
          {...{
            user,
            initialState,
            userSettings,
            settingsDispatch,
            setEditSettings,
          }}
        />
      )}
    </div>
  );
}

function UserSettingsForm({
  user,
  initialState,
  userSettings,
  settingsDispatch,
  setEditSettings,
}) {
  const [blackOuts, blackOutDispatch] = React.useReducer(blackOutReducer, {});
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

  function blackOutReducer(blackOuts, action) {
    switch (action.type) {
      case "editMonday":
        return { ...blackOuts, mon: action.value };

      case "editTuesday":
        return { ...blackOuts, tue: action.value };

      case "editWednesday":
        return { ...blackOuts, wed: action.value };

      case "editThursday":
        return { ...blackOuts, thu: action.value };

      case "editFriday":
        return { ...blackOuts, fri: action.value };

      case "editSaturday":
        return { ...blackOuts, sat: action.value };

      case "editSunday":
        return { ...blackOuts, sun: action.value };

      case "editMisc":
        return { ...blackOuts, miscBlackOuts: action.value };

      case "wipe":
        return { ...initialState };
      default:
        return blackOuts;
    }
  }

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
        return { ...initialState };
      default:
        return blackOuts;
    }
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

  //     settingsDispatch({ type: "wipe", value: { initialState } });
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

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
        <fieldset key={0}>
          <legend>Monday:</legend>
          {tracker.mon.map((time, index) => {
            return (
              <>
                <label key={`0SL${index}`} htmlFor="in-monStart">
                  Start:
                </label>
                <input
                  id="in-monStart"
                  key={`0SI${index}`}
                  type="time"
                  value={tracker.mon[index].start}
                  onChange={(e) => {
                    settingsDispatch({
                      type: "edit",
                      day: "mon",
                      [index]: index,
                      edge: "start",
                      value: e.target.value,
                    });
                  }}
                />
                <label key={`0EL${index}`} htmlFor="in-monEnd">
                  End:
                </label>
                <input
                  id="in-monEnd"
                  key={`0EI${index}`}
                  type="time"
                  value={tracker.mon[index].end}
                  onChange={(e) => {
                    settingsDispatch({
                      type: "edit",
                      day: "mon",
                      [index]: index,
                      edge: "end",
                      value: e.target.value,
                    });
                  }}
                />
                <button
                  key={`0D${index}`}
                  value="remove"
                  onClick={(e) => {
                    settingsDispatch({
                      type: "delete",
                      day: "mon",
                      [index]: index,
                      edge: "end",
                      value: e.target.value,
                    });
                  }}
                >
                  Remove
                </button>
              </>
            );
          })}
          //ADD BUTTON
        </fieldset>

        <fieldset>
          <legend>Tuesday:</legend>
          <label htmlFor="in-tueStart">Start:</label>
          <input
            id="in-tueStart"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editTuesdayStart",
                value: e.target.value,
              });
            }}
          />
          <label htmlFor="in-tueEnd">End:</label>
          <input
            id="in-tueEnd"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editTuesdayEnd",
                value: e.target.value,
              });
            }}
          />
        </fieldset>
        <fieldset>
          <legend>Wednesday:</legend>
          <label htmlFor="in-wedStart">Start:</label>
          <input
            id="in-wedStart"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editWednesdayStart",
                value: e.target.value,
              });
            }}
          />
          <label htmlFor="in-wedEnd">End:</label>
          <input
            id="in-wedEnd"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editWednesdayEnd",
                value: e.target.value,
              });
            }}
          />
        </fieldset>
        <fieldset>
          <legend>Thursday:</legend>
          <label htmlFor="in-thuStart">Start:</label>
          <input
            id="in-thuStart"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editThursdayStart",
                value: e.target.value,
              });
            }}
          />
          <label htmlFor="in-thuEnd">End:</label>
          <input
            id="in-thuEnd"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editThursdayEnd",
                value: e.target.value,
              });
            }}
          />
        </fieldset>
        <fieldset>
          <legend>Friday:</legend>
          <label htmlFor="in-friStart">Start:</label>
          <input
            id="in-friStart"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editFridayStart",
                value: e.target.value,
              });
            }}
          />
          <label htmlFor="in-friEnd">End:</label>
          <input
            id="in-friEnd"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editFridayEnd",
                value: e.target.value,
              });
            }}
          />
        </fieldset>
        <fieldset>
          <legend>Saturday:</legend>
          <label htmlFor="in-satStart">Start:</label>
          <input
            id="in-satStart"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editSaturdayStart",
                value: e.target.value,
              });
            }}
          />
          <label htmlFor="in-satEnd">End:</label>
          <input
            id="in-satEnd"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editSaturdayEnd",
                value: e.target.value,
              });
            }}
          />
        </fieldset>
        <fieldset>
          <legend>Sunday:</legend>
          <label htmlFor="in-sunStart">Start:</label>
          <input
            id="in-sunStart"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editSundayStart",
                value: e.target.value,
              });
            }}
          />
          <label htmlFor="in-sunEnd">End:</label>
          <input
            id="in-sunEnd"
            type="time"
            value={userSettings.estTime}
            onChange={(e) => {
              settingsDispatch({
                type: "editSundayEnd",
                value: e.target.value,
              });
            }}
          />
        </fieldset>
      </fieldset>
      <fieldset>
        <legend>Miscellaneous</legend>
        <label htmlFor="in-MiscBlackOut">Dates</label>
        <input
          id="in-MiscBlackOut"
          type="datetime-local"
          value={userSettings.dueDate}
          onChange={(e) => {
            settingsDispatch({
              type: "editMiscBlackOut",
              value: e.target.value,
            });
          }}
        />
      </fieldset>
      <input id="submitSettings" value="Save" type="submit" />
      <input
        type="button"
        value="cancel"
        onClick={(e) => {
          settingsDispatch({ type: "wipe", value: null });
          setEditSettings(false);
        }}
      />
    </form>
  );
}

export default Account;
