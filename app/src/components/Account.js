import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import * as ApiClient from "../ApiClient";

function Account({
  tab,
  isAuthenticated,
  isLoggedIn,
  setLoggedIn,
  gcal,
  user,
  setUser,
}) {
  //Empty add form
  const initialState = {
    pushNotifications: user.timedown.pushNotifications,
    addToGoogleCal: user.timedown.addToGoogleCal,
    awakeTimeStart: 0,
    awakeTimeEnd: 0,
    dueDate: new Date(),
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

  function reducer(state, action) {
    switch (action.type) {
      case "editSummary":
        return { ...state, summary: action.value };

      case "editDescription":
        return { ...state, description: action.value };

      case "editEventBufferHours":
        return { ...state, eventBuffferHours: action.value };

      case "editEventBufferMinutes":
        return { ...state, eventBuffferMinutes: action.value };

      case "editAwakeTimeStart":
        return { ...state, awakeTimeStart: action.value };

      case "editAwakeTimeEnd":
        return { ...state, awakeTimeEnd: action.value };

      case "editWeeklyBlackOuts":
        return { ...state, dueDate: action.value };

      case "wipe":
        return { ...initialState };
      default:
        return state;
    }
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiClient.addTask(
        user.timedown.id,
        state.dueDate,
        state.estTimeHours,
        state.estTimeMinutes,
        state.summary,
        state.description,
      );

      const update = JSON.stringify(response);
      window.alert("Task submitted!");

      const data = JSON.parse(update);

      //getTasksInfo();

      dispatch({ type: "wipe", value: { initialState } });
    } catch (err) {
      console.error(err.message);
    }
  };
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
      <h3 className="formTitle">Edit Settings</h3>
      <form
        className="userSettingsForm"
        id="settingsSubmission"
        onSubmit={onSubmitForm}
      >
        <label htmlFor="in-pushNotifications">Push Notifications:</label>
        <input
          id="in-pushNotifications"
          type="checkbox"
          value={state.summary}
          onChange={(e) => {
            dispatch({ type: "editPushNotifications", value: e.target.value });
          }}
        />
        <label htmlFor="in-addToGoogleCal">
          Add task times to Google Calendar:
        </label>
        <input
          id="in-addToGoogleCal"
          value={state.description}
          type="checkbox"
          onChange={(e) => {
            dispatch({ type: "editAddToGoogleCal", value: e.target.value });
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
            value={state.estTime}
            onChange={(e) => {
              dispatch({ type: "editEventBufferHours", value: e.target.value });
            }}
          />
          <label htmlFor="in-eventBufferMinutes">Minutes:</label>
          <input
            id="in-eventBufferMinutes"
            type="number"
            step="5"
            min="0"
            max="55"
            value={state.estTime}
            onChange={(e) => {
              dispatch({
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
            value={state.estTime}
            onChange={(e) => {
              dispatch({ type: "editAwakeTimeStart", value: e.target.value });
            }}
          />
          <label htmlFor="in-awakeTimeEnd">End:</label>
          <input
            id="in-awakeTimeEnd"
            type="time"
            value={state.estTime}
            onChange={(e) => {
              dispatch({ type: "editAwakeTimeEnd", value: e.target.value });
            }}
          />
        </fieldset>
        <fieldset>
          <legend>Weekly Scheduling</legend>
          <label htmlFor="in-Monday">
            Monday
            <input
              id="in-awakeTimeStart"
              type="time"
              value={state.estTime}
              onChange={(e) => {
                dispatch({ type: "editAwakeTimeStart", value: e.target.value });
              }}
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>Miscellaneous</legend>
          <label htmlFor="in-MiscBlackOut">Dates</label>
          <input
            id="in-MiscBlackOut"
            type="datetime-local"
            value={state.dueDate}
            onChange={(e) => {
              dispatch({ type: "editMiscBlackOut", value: e.target.value });
            }}
          />
        </fieldset>
        <input id="submitSettings" value="Save" type="submit" />{" "}
        <input
          type="button"
          value="cancel"
          onClick={(e) => {
            dispatch({ type: "wipe", value: e.target.value });
          }}
        />
      </form>
    </div>
  );
}

export default Account;
