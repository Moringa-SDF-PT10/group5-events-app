import React from "react";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4">
      {user ? (
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome back, {user.username}!</h1>
          <p className="text-lg mb-8">Go to your dashboard to manage your events.</p>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-bold mb-4 text-center">Welcome to EventHub</h1>
          <p className="text-lg mb-8 text-center">Create, view, and manage your events with ease.</p>
          <div className="flex space-x-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Login / Sign Up
            </Link>
            <a
              href="#features"
              className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-purple-600 transition"
            >
              Learn More
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
