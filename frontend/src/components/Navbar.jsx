import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        EventHub
      </Link>

      <div className="nav-links">
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>

        {user && (
          <>

            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/events" className={linkClass}>
              Events
            </NavLink>
            <NavLink to="/create-event" className={linkClass}>
              Create Event
            </NavLink>
            <NavLink to="/mytickets" className={linkClass}>
              My Tickets
            </NavLink>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}

        {!user && (
          <NavLink to="/login" className={linkClass}>
            Login / Sign Up
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
