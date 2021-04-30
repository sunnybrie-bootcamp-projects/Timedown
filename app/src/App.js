import "./App.css";

import * as React from "react";

import Account from "./Account.js";
import DetailsBoard from "./components/DetailsBoard.js";
import gcal from "./api/ApiCalendar";
import Planner from "./components/Planner.js";
// import * as apiClient from "./apiClient";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(gcal.sign);

  React.useEffect(() => {
    gcal.onLoad(() => {
      setIsAuthenticated(gcal.gapi.auth2.getAuthInstance().isSignedIn.get());
      gcal.listenSign((sign) => setIsAuthenticated(sign));
    });
  }, []);

  return (
    <main className="App">
      <h1>Here it is!</h1>
      <Login {...{ isAuthenticated }} />
      {isAuthenticated ? <Events /> : null}
    </main>
  );
};

const Login = ({ isAuthenticated }) =>
  isAuthenticated ? (
    <button onClick={gcal.handleSignoutClick}>Log out</button>
  ) : (
    <button onClick={gcal.handleAuthClick}>Log in</button>
  );

const Events = () => {
  const [events, setEvents] = React.useState([]);

  React.useEffect(() => {
    gcal
      .listUpcomingEvents(10)
      .then(({ result: { items } }) => setEvents(items));
  }, []);

  return events.length === 0 ? null : (
    <ul>
      {events.map((event) => (
        <li key={event.id}>{event.summary}</li>
      ))}
    </ul>
  );
};

export default App;
