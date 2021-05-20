import "./App.css";

import * as React from "react";

import * as ApiClient from "./ApiClient";
import gcal from "./api/ApiCalendar";
import Planner from "./components/Planner.js";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(gcal.sign);
  const [user, setUser] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loginMessage, setLoginMessage] = React.useState("Get started!");

  async function getUserInfo(account) {
    switch (account) {
      case "google":
        if (isAuthenticated) {
          let googleUserInfo = await gcal.getBasicUserProfile();
          setUser({ ...user, google: googleUserInfo });
          //console.debug(googleUserInfo);
        }
        break;
      case "timedown":
        if (isAuthenticated && user.google) {
          if (user.new) {
            let register = await ApiClient.addUser(
              user.google.getEmail(),
              user.google.getGivenName(),
            );
            setLoginMessage(register.message);
            setUser({ ...user, new: false, timedown: register.account });
          } else {
            let timedownUserInfo = await ApiClient.getUser(
              user.google.getEmail(),
            );
            if (timedownUserInfo.error) {
              setLoginMessage(timedownUserInfo.error);
              gcal.handleSignoutClick();
              setUser({});
            } else {
              setUser({ google: user.google, timedown: timedownUserInfo });
              setLoginMessage("Loading account information...");
            }
          }
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
      <h2>Welcome to Timedown!</h2>
      <p>
        Timedown is an app designed to make it easier to manage your time. Log
        in or register, add a task to your taskboard, and get suggestions for
        times to work on it so you can finish it by its duedate!
      </p>
      <p>{loginMessage}</p>
      <Login {...{ loggedIn, gcal, setUser, user }} />
    </main>
  );
};

function UserDashboard({
  isAuthenticated,
  loggedIn,
  setLoggedIn,
  gcal,
  user,
  setUser,
}) {
  return (
    <main className="app">
      <h1>Timedown</h1>
      <Planner
        {...{ isAuthenticated, loggedIn, setLoggedIn, gcal, user, setUser }}
      />
    </main>
  );
}

const Login = ({ loggedIn, gcal, setUser, user }) => {
  return (
    <div className="login">
      Returning Users:{" "}
      <button onClick={gcal.handleAuthClick}>Log in with Google</button>
      Guests:{" "}
      <button
        onClick={() => {
          setUser({ ...user, new: true });
          gcal.handleAuthClick();
        }}
      >
        Register with Google
      </button>
    </div>
  );
};

export default App;
