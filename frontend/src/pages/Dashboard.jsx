import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-purple-600 mb-6">
        Welcome, {user.username || user.email}!
      </h1>
      <p className="mb-8 text-gray-700">
        Here's a quick overview of your EventHub account.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Events Card */}
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

        {/* My Tickets Card */}
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

        {/* Create Event Card */}
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
