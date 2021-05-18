import React, { useState, useEffect } from "react";

function Account({
  isAuthenticated,
  isLoggedIn,
  setLoggedIn,
  gcal,
  user,
  setUser,
}) {
  return (
    <div className="AccountPanel">
      <h2>Logged in as...</h2>
      <img id="profilePic" alt="profile photo" src={user.google.imageUrl} />
      <h3> {user.name} </h3>
      <button
        onClick={() => {
          gcal.handleSignoutClick();
          setLoggedIn(false);
          setUser({});
        }}
      >
        Log out
      </button>
    </div>
  );
}

export default Account;
