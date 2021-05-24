import React from "react";

const Login = ({ loggedIn, gcal }) => {
  return loggedIn ? (
    <button onClick={gcal.handleSignoutClick}>Log out</button>
  ) : (
    <div className="login">
      <button onClick={gcal.handleAuthClick}>Log in with Google</button>
      <button onClick={gcal.handleAuthClick}>Register with Google</button>
    </div>
  );
};

export default Login;
