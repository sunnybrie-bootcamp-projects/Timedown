import "./App.css";

import * as React from "react";

import Account from "./Account.js";
import DetailsBoard from "./components/DetailsBoard.js";
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

  React.useEffect(() => {}, []);

  return (
    <main className="App">
      <Planner />
      <DetailsBoard />
    </main>
  );
};

export default App;
