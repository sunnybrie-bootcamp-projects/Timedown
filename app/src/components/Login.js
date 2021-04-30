import React from "react";

const Login = ({ isAuthenticated, gcal }) => {
  return isAuthenticated ? (
    <button onClick={gcal.handleSignoutClick}>Log out</button>
  ) : (
    <button onClick={gcal.handleAuthClick}>Log in</button>
  );
};

export default Login;
