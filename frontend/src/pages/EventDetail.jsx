import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EventDetails.css";

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data.event);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBookTicket = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/tickets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: event.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to book ticket");
      }
      alert("Ticket booked successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="container">Loading event...</p>;
  if (error) return <p className="container error">{error}</p>;
  if (!event) return null;

  return (
    <div className="container event-detail">
      <h1>{event.title}</h1>
      <p className="event-date">{event.date}</p>
      <p>{event.description}</p>
      <button className="btn" onClick={handleBookTicket}>
        Book Ticket
      </button>
    </div>
  );
}

export default EventDetail;
