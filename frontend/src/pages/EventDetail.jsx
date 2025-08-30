import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function EventDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch single event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        console.log("🎟 Event fetched:", data);

        // Backend returns {event: {...}} or just {...}, so be safe:
        setEvent(data.event || data);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // ✅ Correct booking to match your backend route (/tickets)
  const handleBookTicket = async () => {
    if (!token) {
      setMessage("⚠️ You must be logged in to book a ticket");
      return;
    }
    try {
      setBooking(true);
      setMessage("");
      const res = await fetch(`/tickets/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: id }), 
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to book ticket");
      }
      const data = await res.json();
      console.log("🎫 Ticket booked:", data);
      setMessage("✅ Ticket booked successfully!");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <p className="text-gray-600">Loading event...</p>;
  if (!event) return <p className="text-red-600">{message || "Event not found"}</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-3xl font-bold text-purple-600 mb-4">
        {event.title || event.name}
      </h2>
      <p className="text-gray-700 mb-4">
        {event.description || event.details || "No description available."}
      </p>
      <p className="text-gray-500 mb-2">
        <span className="font-semibold">📅 Date:</span>{" "}
        {event.date || event.event_date || "Not specified"}
      </p>
      <p className="text-gray-500 mb-6">
        <span className="font-semibold">📍 Location:</span>{" "}
        {event.location || "Not specified"}
      </p>

      <button
        onClick={handleBookTicket}
        disabled={booking}
        className={`px-4 py-2 rounded text-white transition ${
          booking
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {booking ? "Booking..." : "Book Ticket"}
      </button>

      {message && (
        <p
          className={`mt-4 font-medium ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
