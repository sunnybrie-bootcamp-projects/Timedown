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
      return { ...state, Summary: action.value };

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
function TaskAddForm(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  //const [numSeen, plusMinus] = React.useState([""]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = state;
      console.log("Attempting to post...", JSON.stringify(body)); // TEST

      const response = await dbRequest.addTask(state.summary);
      response.catch((e) => {
        console.log(`Task POST request didn't send...`); //TEST
      });

      const update = await response.json();
      console.log(`Server Response`, update); //TEST
      window.alert("Task submitted!");

      //props.fetchData();
      dispatch({ type: "wipe", value: { initialState } });

      window.estTime = "/";
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
          <h2 className="tableTitle">Report New Sighting</h2>
        </div>
        <label for="in-Date">Date Seen:</label>
        <input
          id="in-Date"
          type="datetime-local"
          value={state.date}
          onChange={(e) => {
            dispatch({ type: "editDate", value: e.target.value });
          }}
        />
        {numSeen.map((value, index) => {
          return (
            <>
              <label key={index + 30} for="in-Name">
                Name:
              </label>
              <input
                key={index + 31}
                id="in-Name"
                type="text"
                value={state.summary[index]}
                onChange={(e) => {
                  dispatch({
                    type: "editName",
                    value: numSeen.map((n, i) => {
                      if (i === index) {
                        return e.target.value;
                      }

                      return state.summary[i];
                    }),
                    index: e.target.index,
                  });
                }}
              />
            </>
          );
        })}

        <button onClick={() => plusMinus(numSeen.concat([""]))}>+</button>
        {numSeen.length > 1 ? (
          <button
            onClick={() =>
              plusMinus(() => {
                numSeen.splice(numSeen.length - 2, 1);
                return numSeen;
              })
            }
          >
            -
          </button>
        ) : (
          <> </>
        )}

        <label for="in-Health"> Appeared Healthy? </label>
        <div
          id="in-Health"
          onChange={(e) => {
            dispatch({ type: "editHealth", value: e.target.value });
          }}
        >
          <input type="radio" value={true} summary="gender" /> Yes
          <input type="radio" value={false} summary="gender" /> No
        </div>

        <label for="in-Location">Location of Sighting:</label>
        <input
          id="in-Location"
          rows="10"
          cols="30"
          value={state.desc}
          onChange={(e) => {
            dispatch({ type: "editLocation", value: e.target.value });
          }}
        />

        <label for="in-Email">Your Email:</label>
        <input
          id="in-Email"
          type="text"
          value={state.Email}
          onChange={(e) => {
            dispatch({ type: "editEmail", value: e.target.value });
          }}
        />

        <input id="submitSighting" type="submit" />
      </form>
    </>
  );
}

export default TaskAddForm;
