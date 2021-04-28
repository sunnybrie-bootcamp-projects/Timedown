import React, { useState, useEffect } from "react";

import { GoogleLogin, GoogleLogout } from "react-google-login";

function Account() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({});

  function responseGoogle(response) {
    console.log(response);
    setUser(response.profileObj);
    setIsSignedIn(true);
  }

  function logOut() {
    setUser({});
    setIsSignedIn(false);
    console.log("logout successful");
  }

  useEffect(() => {
    console.log(user);
  }, [user, isSignedIn]);

  return (
    <div>
      {isSignedIn ? (
        <>
          <h2>Logged in as...</h2>
          <img id="profilePic" alt="profile photo" src={user.imageUrl} />
          <h3> {user.name} </h3>
        </>
      ) : (
        <p>Login to use this app!</p>
      )}
      <GoogleLogin
        clientId="672610100992-9ob4krjvvh9kfs8sr0jb4d7hlsvcmcv8.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />

      <button onClick={logOut}>Logout</button>
    </div>
  );
}

export default Account;
