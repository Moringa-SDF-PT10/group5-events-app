import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import axios from "axios";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user from storage (prefer localStorage first, fallback to sessionStorage)
  const storedUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        const res = await axios.get("/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Adjust this depending on your backend response shape
        setEvents(Array.isArray(res.data) ? res.data : res.data.events || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    if (!token) return alert("You must be logged in");

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      alert("Event deleted successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        "Failed to delete event: " + (err.response?.data?.error || err.message)
      );
    }
  };

  if (loading) return <p className="container">Loading events...</p>;
  if (error) return <p className="container error">{error}</p>;

  return (
    <div className="container">
      <h1 className="page-title">All Events</h1>
      {events.length === 0 ? (
        <p className="no-events">No events available at the moment.</p>
      ) : (
        <div className="grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={handleDelete}
              canDelete={event.creator_id === userId} // only show delete for user's events
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
