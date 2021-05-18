import "./App.css";

import * as React from "react";

import Account from "./Account.js";
import gcal from "./api/ApiCalendar";
import Planner from "./components/Planner.js";
import * as dbRequest from "./dbRequest";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(gcal.sign);
  const [user, setUser] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);

  async function getUserInfo(account) {
    switch (account) {
      case "google":
        if (isAuthenticated) {
          var googleUserInfo = await gcal.getBasicUserProfile();
          setUser({ ...user, google: googleUserInfo });
          //console.debug(googleUserInfo);
        }
        break;
      case "timedown":
        if (isAuthenticated && user.google) {
          var timedownUserInfo = await dbRequest.getUser(
            user.google.getEmail(),
          );
          setUser({ ...user, timedown: timedownUserInfo });
          //console.debug(timedownUserInfo);
        }
        break;
      default:
        break;
    }
  }

  //Authenticate client
  React.useEffect(() => {
    gcal.onLoad(() => {
      setIsAuthenticated(gcal.gapi.auth2.getAuthInstance().isSignedIn.get());
      gcal.listenSign((sign) => setIsAuthenticated(sign));
    });
  }, []);

  //load google user info
  React.useEffect(() => {
    getUserInfo("google");
  }, [isAuthenticated]);

  //fetch timedown account
  React.useEffect(() => {
    getUserInfo("timedown");
  }, [user.google]);

  //logged in!
  React.useEffect(() => {
    if (user.timedown) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [user.timedown]);

  if (loggedIn) {
    return (
      <UserDashboard
        {...{
          isAuthenticated,
          gcal,
          setUser,
          user,
          setLoggedIn,
        }}
      />
    );
  }

  return (
    <main className="App">
      <div id="login">
        <Login {...{ isAuthenticated, gcal }} />
      </div>
    </main>
  );
};

function UserDashboard({ isAuthenticated, gcal, setUser, user, setLoggedIn }) {
  return (
    <main>
      <div id="login">
        <button
          onClick={() => {
            gcal.handleSignoutClick();
            setLoggedIn(false);
          }}
        >
          Log out
        </button>
      </div>
      <div className="app">
        <h1>Timedown</h1>
        <Planner {...{ isAuthenticated, gcal, user }} />
      </div>
    </main>
  );
}

const Login = ({ isAuthenticated, gcal }) => {
  return <button onClick={gcal.handleAuthClick}>Log in with Google</button>;
};

export default App;
