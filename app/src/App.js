import "./App.css";

import * as React from "react";

import Account from "./Account.js";
import gcal from "./api/ApiCalendar";
import DetailsBoard from "./components/DetailsBoard.js";
import Login from "./components/Login";
import Planner from "./components/Planner.js";
import * as dbRequest from "./dbRequest";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(gcal.sign);
  const [googleAccount, setGoogleAccount] = React.useState({});
  const [timedownAccount, setTimedownAccount] = React.useState({});

  async function getUserInfo(account) {
    switch (account) {
      case "google":
        if (isAuthenticated) {
          var googleUserInfo = await gcal.getBasicUserProfile();
          setGoogleAccount(googleUserInfo);
          //console.debug(googleUserInfo);
        }
        break;
      case "timedown":
        if (isAuthenticated) {
          var timedownUserInfo = await dbRequest.getUser(
            googleAccount.getEmail(),
          );
          setTimedownAccount(timedownUserInfo);
          //console.debug(timedownUserInfo);
        }
        break;
      default:
        break;
    }
  }

  React.useEffect(() => {
    gcal.onLoad(() => {
      setIsAuthenticated(gcal.gapi.auth2.getAuthInstance().isSignedIn.get());
      gcal.listenSign((sign) => setIsAuthenticated(sign));
    });
  }, []);

  React.useEffect(() => {
    getUserInfo("google");
  }, [isAuthenticated]);

  React.useEffect(() => {
    getUserInfo("timedown");
  }, [googleAccount]);

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
