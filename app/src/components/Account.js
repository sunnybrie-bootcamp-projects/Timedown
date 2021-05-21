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
        <>
          <UserSettingsForm
            {...{
              user,
              setUser,
              setEditSettings,
            }}
          />
          <button onClick={() => setEditSettings(false)}>Cancel</button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

function UserSettingsForm({ user, setUser, setEditSettings }) {
  const [isReady, setIsReady] = React.useState(false);
  //manages changes to user's settings
  const [userSettings, settingsDispatch] = React.useReducer(
    settingsReducer,
    {},
  );

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiClient.updateSettings(
        user.timedown.id,
        userSettings,
      );

      const update = await ApiClient.getUser(user.timedown.email);

      setUser({ ...user, timedown: { ...user.timedown, ...update } });
      window.alert("Settings saved!");

      setEditSettings(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useLayoutEffect(() => {
    settingsDispatch({
      type: "set",
      value: {
        awakeTime: { ...user.timedown.awakeTime },
        eventBuffer: { ...user.timedown.eventBuffer },
      },
    });
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, [userSettings]);

  if (isReady) {
    return (
      <form
        className="userSettingsForm"
        id="settingsSubmission"
        onSubmit={onSubmitForm}
      >
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

        <input type="submit" />
      </form>
    );
  } else {
    return <p className="loadingMessage">Loading user settings...</p>;
  }
}

function settingsReducer(userSettings, action) {
  switch (action.type) {
    case "set":
      return { ...userSettings, ...action.value };

    case "editEventBufferHours":
      return {
        ...userSettings,
        eventBuffer: { ...userSettings.eventBuffer, hours: action.value },
      };

    case "editEventBufferMinutes":
      return {
        ...userSettings,
        eventBuffer: { ...userSettings.eventBuffer, minutes: action.value },
      };

    case "editAwakeTimeStart":
      return {
        ...userSettings,
        awakeTime: { ...userSettings.awakeTime, start: action.value },
      };

    case "editAwakeTimeEnd":
      return {
        ...userSettings,
        awakeTime: { ...userSettings.awakeTime, end: action.value },
      };
    default:
      return userSettings;
  }
}

export default Account;
