import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded hover:bg-purple-600 hover:text-white transition ${
      isActive ? "bg-purple-600 text-white" : "text-gray-800"
    }`;

  return (
    <nav className="w-full bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-purple-600">
        EventHub
      </Link>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/login" className={linkClass}>
              Login / Sign Up
            </NavLink>
            <NavLink to="/create-event" className={linkClass}>
              Create Event
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
