import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import "./MyTickets.css";

function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (!user) return;
        const token = localStorage.getItem("access_token");
        const res = await fetch("/tickets/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        setTickets(data.tickets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (loading) return <p className="container">Loading tickets...</p>;
  if (error) return <p className="container error">{error}</p>;
  if (tickets.length === 0)
    return <p className="container no-tickets">You have no tickets booked yet.</p>;

  return (
    <div className="container my-tickets">
      <h1 className="page-title">My Tickets</h1>
      <div className="tickets-grid">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="ticket-card">
            <div className="ticket-content">
              <h2>{ticket.event.title}</h2>
              <p className="event-date">{ticket.event.date}</p>
              <p>Ticket ID: {ticket.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTickets;
