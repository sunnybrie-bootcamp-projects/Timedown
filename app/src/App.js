import "./App.css";

import * as React from "react";

import Account from "./Account.js";
import gcal from "./api/ApiCalendar";
import DetailsBoard from "./components/DetailsBoard.js";
import Login from "./components/Login";
import Planner from "./components/Planner.js";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(gcal.sign);
  const [currentUser, setCurrentUser] = React.useState({});

  async function getUserInfo() {
    if (isAuthenticated) {
      var userInfo = await gcal.getBasicUserProfile();
      setCurrentUser(userInfo);
      console.debug(userInfo);
    }
  }

  React.useEffect(() => {
    gcal.onLoad(() => {
      setIsAuthenticated(gcal.gapi.auth2.getAuthInstance().isSignedIn.get());
      gcal.listenSign((sign) => setIsAuthenticated(sign));
    });
  }, []);

  React.useEffect(() => {
    getUserInfo();
    if (currentUser !== {}) {
      console.debug(currentUser.getName());
    }
  }, [isAuthenticated]);

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
