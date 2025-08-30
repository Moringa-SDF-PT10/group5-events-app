import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import "./MyTickets.css";

function MyTickets() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user, token } = useAuth(); // ✅ use both from context
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {


    const fetchTickets = async () => {
      try {
        const res = await fetch(`${API_URL}/tickets/my`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ send Bearer token
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to fetch tickets");
        }

        const data = await res.json();
        setTickets(data.tickets || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) { // ✅ only fetch when token exists
      fetchTickets();
    }
  }, [token]);

  // While waiting for token, stay in loading mode
  if (!token && loading) return <p className="container">Loading tickets...</p>;
  if (loading) return <p className="container">Loading tickets...</p>;
  if (error) return <p className="container error">{error}</p>;
  if (tickets.length === 0)
    return (
      <p className="container no-tickets">
        You have no tickets booked yet.
      </p>
    );

  return (
    <div className="container my-tickets">
      <h1 className="page-title">My Tickets</h1>
      <div className="tickets-grid">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-content">
              <h2>{ticket.event?.title || "Unknown Event"}</h2>
              <p className="event-date">{ticket.event?.date}</p>
              <p>Ticket ID: {ticket.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTickets;
