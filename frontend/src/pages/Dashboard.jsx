import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import axios from "axios";

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, setUser, token, loading } = useAuth();
  const [newUsername, setNewUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  useEffect(() => {
    setNewUsername(user?.username || "");
  }, [user]);

  const getAuthToken = () =>
    token ||
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    const trimmedUsername = (newUsername || "").trim();
    if (!trimmedUsername) {
      setMessage("Username cannot be empty");
      return;
    }
    if (trimmedUsername === (user?.username || "")) {
      setMessage("Username is the same as before");
      return;
    }

    const authToken = getAuthToken();
    if (!authToken) {
      setMessage("You are not authenticated. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.patch(
        `${API_URL}/auth/update-profile`,
        { username: trimmedUsername },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUser = res.data.user;
      // Update in-memory context
      setUser(updatedUser);

      // Persist where the token actually lives
      if (localStorage.getItem("access_token")) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else if (sessionStorage.getItem("access_token")) {
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        // fallback — store in localStorage so next page reload sees it
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setMessage("Username updated successfully!");
    } catch (err) {
      console.error("Update profile error:", err.response?.data || err);
      const serverMsg =
        err.response?.data?.error || err.response?.data?.message;
      setMessage(serverMsg || "Failed to update username");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Welcome Message */}
      <h1 className="text-4xl font-bold text-purple-600 mb-6">
        Welcome, {user?.username || user?.email || "Guest"}!
      </h1>
      <p className="mb-8 text-gray-700">
        Here's a quick overview of your EventHub account.
      </p>

      {/* Update Profile Section */}
      <section className="mb-8 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">
          Update Profile
        </h2>
        <form
          onSubmit={handleUpdate}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="p-2 border rounded w-full sm:w-auto"
            placeholder="New username"
            required
            aria-label="new username"
          />
          <button
            type="submit"
            disabled={
              isSubmitting || newUsername.trim() === (user?.username || "")
            }
            className={`px-4 py-2 rounded text-white transition ${
              newUsername.trim() === (user?.username || "")
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-2 ${
              message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </section>

      {/* Event / Ticket / Create Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link
          to="/events"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl font-semibold mb-2">All Events</h2>
            <p className="text-gray-500">Browse all available events.</p>
          </div>
          <div className="mt-4 text-right text-purple-600 font-bold">→</div>
        </Link>

        <Link
          to="/mytickets"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl font-semibold mb-2">My Tickets</h2>
            <p className="text-gray-500">View tickets you've booked.</p>
          </div>
          <div className="mt-4 text-right text-purple-600 font-bold">→</div>
        </Link>

        <Link
          to="/create-event"
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition flex flex-col justify-between"
        >
          <div>
            <h2 className="text-2xl font-semibold mb-2">Create Event</h2>
            <p className="text-gray-500">Add a new event for others to attend.</p>
          </div>
          <div className="mt-4 text-right text-purple-600 font-bold">→</div>
        </Link>
      </div>

      {/* Quick Stats Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-purple-600">Quick Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-purple-600 text-white p-6 rounded-xl shadow">
            <p className="text-xl font-semibold">12</p>
            <p className="mt-2">Events created</p>
          </div>
          <div className="bg-purple-500 text-white p-6 rounded-xl shadow">
            <p className="text-xl font-semibold">5</p>
            <p className="mt-2">Tickets booked</p>
          </div>
          <div className="bg-purple-400 text-white p-6 rounded-xl shadow">
            <p className="text-xl font-semibold">3</p>
            <p className="mt-2">Upcoming events</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
