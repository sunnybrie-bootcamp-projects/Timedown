import React, { useEffect, useState } from "react";

import * as dbRequest from "../dbRequest";

//Empty add form
const initialState = {
  summary: "",
  description: "",
  estTime: "",
  dueDate: new Date(),
};

function reducer(state, action) {
  switch (action.type) {
    case "editSummary":
      return { ...state, summary: action.value };

    case "editDescription":
      return { ...state, description: action.value };

    case "editEstTime":
      return { ...state, estTime: action.value };

    case "editDueDate":
      return { ...state, dueDate: action.value };

    case "wipe":
      return { ...initialState };
    default:
      return state;
  }
}

//ADD FORM, CHILD OF EVENTBOARD
function TaskAddForm({ setTasksList, user }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = state;
      console.log("Attempting to post...", JSON.stringify(body)); // TEST

      const response = await dbRequest.addTask(
        user.timedown.id,
        state.dueDate,
        state.estTime,
        state.summary,
        state.description,
      );

      const update = JSON.stringify(response);
      window.alert("Task submitted!");

      const data = JSON.parse(update);

      setTasksList(data);

      dispatch({ type: "wipe", value: { initialState } });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <form
        className="sightingSubmission"
        id="sightingSubmission"
        action="#sightingSubmission"
        onSubmit={onSubmitForm}
      >
        <div className="topper">
          <h2 className="tableTitle">Add New Task</h2>
        </div>
        <label htmlFor="in-Summary">
          Summary:
          <input
            id="in-Summary"
            type="text"
            value={state.summary}
            onChange={(e) => {
              dispatch({ type: "editSummary", value: e.target.value });
            }}
          />
        </label>

        <label htmlFor="in-Description">
          Description:
          <input
            id="in-Description"
            value={state.description}
            type="text"
            rows="10"
            cols="30"
            onChange={(e) => {
              dispatch({ type: "editDescription", value: e.target.value });
            }}
          />
        </label>

        <label htmlFor="in-EstTime">
          Estimated Time Needed:
          <input
            id="in-EstTime"
            value={state.estTime}
            onChange={(e) => {
              dispatch({ type: "editEstTime", value: e.target.value });
            }}
          />
        </label>

        <label htmlFor="in-DueDate">
          Task Due Date:
          <input
            id="in-DueDate"
            type="datetime-local"
            value={state.dueDate}
            onChange={(e) => {
              dispatch({ type: "editDueDate", value: e.target.value });
            }}
          />
        </label>

        <input id="submitTask" type="submit" />
      </form>
    </>
  );
}

export default TaskAddForm;
