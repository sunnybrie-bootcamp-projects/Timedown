import React, { useState, useEffect } from "react";

function NavBar({ isAuthenticated, gcal, setTab }) {
  return (
    <div className="navBar">
      <button className="navTab" onClick={() => setTab("calendar")}>
        Calendar
      </button>
      <button className="navTab" onClick={() => setTab("taskboard")}>
        Taskboard
      </button>
    </div>
  );
}

export default NavBar;
