import React, { useState, useEffect } from "react";

import GoogleLogin from "react-google-login";

function Account() {
  const [user, setUser] = useState({});

  function responseGoogle(response) {
    console.log(response);
    setUser(response.profileObj);
  }

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div>
      {user !== {} ? (
        <>
          <h2>Logged in as...</h2>
          <img id="profilePic" alt="profile photo" src={user.imageUrl} />
          <h3> {user.name} </h3>
        </>
      ) : (
        `<p>User not found...</p>`
      )}
      <GoogleLogin
        clientId="672610100992-9ob4krjvvh9kfs8sr0jb4d7hlsvcmcv8.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
}

export default Account;
