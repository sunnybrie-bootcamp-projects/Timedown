import React, { useState, useEffect } from "react";

function NavBar({ isAuthenticated, gcal, setTab }) {
  return (
    <div className="navBar">
      <button onClick={() => setTab("calendar")}>Calendar</button>
      <button onClick={() => setTab("taskboard")}>Taskboard</button>
    </div>
  );
}

export default NavBar;
