import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`/events/${id}`)
      .then(res => res.json())
      .then(data => setEvent(data))
      .catch(err => console.error(err));
  }, [id]);

  const bookTicket = async () => {
    if (!user) return navigate("/login");

    try {
      const res = await fetch("/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ event_id: event.id }),
      });

      if (!res.ok) throw new Error("Booking failed");
      alert("Ticket booked successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-2">{event.description}</p>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <p>Price: {event.price > 0 ? `$${event.price}` : "Free"}</p>
      <p>Available Tickets: {event.available_tickets}</p>

      <button
        onClick={bookTicket}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
      >
        Book Ticket
      </button>
    </div>
  );
}
