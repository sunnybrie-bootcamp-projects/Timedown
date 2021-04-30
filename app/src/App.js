import "./App.css";

import * as React from "react";

import Account from "./Account.js";
import gcal from "./api/ApiCalendar";
import DetailsBoard from "./components/DetailsBoard.js";
import Login from "./components/Login";
import Planner from "./components/Planner.js";

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
      <div id="login">
        <Login {...{ isAuthenticated, gcal }} />
      </div>

      <Planner {...{ isAuthenticated, gcal }} />
      <DetailsBoard />
    </main>
  );
};

export default App;
