import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import EventCard from "../components/EventCard";
import axios from "axios";
import "./Events.css";

function Events() {
 const API_URL = import.meta.env.VITE_API_URL;
  const { user, token, loading: authLoading } = useAuth(); // ✅ get user and token from context
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?.id; // ✅ use context user

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) return; // wait until token is available

      try {
        const res = await axios.get(`${API_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(res.data.events || []); // adjust if backend returns array directly
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchEvents(); // fetch after auth finishes loading
  }, [token, authLoading]);

  const handleDelete = async (eventId) => {
    if (!token) return alert("You must be logged in");

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`${API_URL}/events/${eventId}`, {
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

  if (loading || authLoading) return <p className="container">Loading events...</p>;
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
