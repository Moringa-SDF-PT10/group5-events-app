import React from "react";
import { Link } from "react-router-dom";
import "./EventCard.css";

function EventCard({ event, onDelete, canDelete }) {
  return (
    <div className="event-card">
      <div className="event-card-content">
        <h2>{event.title}</h2>
        <p className="event-date">{event.date}</p>
        <p>{event.description?.slice(0, 100)}...</p>
        <div className="event-card-actions">
          <Link to={`/event/${event.id}`} className="btn">
            See Event Details
          </Link>
          {canDelete && (
            <button className="btn btn-delete" onClick={() => onDelete(event.id)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
