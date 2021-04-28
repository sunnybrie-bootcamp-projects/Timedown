import "./App.css";

import * as React from "react";

import Account from "./Account.js";
import Planner from "./components/Planner.js";
// import * as apiClient from "./apiClient";

const App = () => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [user, setUser] = React.useState({});

  function logOut() {
    setUser({});
    setIsSignedIn(false);
    console.log("logout successful");
  }

  React.useEffect(() => {
    console.log(user);
  }, [user, isSignedIn]);

  return (
    <main className="App">
      <h1>Here it is!</h1>
      <Account
        user={user}
        setUser={(e) => setUser(e)}
        logOut={() => logOut()}
        isSignedIn={isSignedIn}
        setIsSignedIn={(e) => setIsSignedIn(e)}
      />
      {isSignedIn ? <Planner /> : <p>Yo, sign in already.</p>}
    </main>
  );
};

export default App;
