import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login"; // AuthPage exported as default
import CreateEvent from "./pages/CreateEvent";
import EventDetail from "./pages/EventDetail";
import Events from "./pages/Events";
import MyTickets from "./pages/MyTickets";
import Dashboard from "./pages/Dashboard";

// Temporary Dashboard page
// const Dashboard = () => (
//   <div className="p-6 text-center">
//     <h1 className="text-3xl font-bold text-purple-600">Dashboard</h1>
//     <p>Welcome! You’re logged in 🎉</p>
//   </div>
// );

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />

    {/* Protected routes */}
    <Route
      path="/events"
      element={
        <ProtectedRoute>
          <Events />
        </ProtectedRoute>
      }
    />
    <Route
      path="/event/:id"
      element={
        <ProtectedRoute>
          <EventDetail />
        </ProtectedRoute>
      }
    />
    <Route
      path="/create-event"
      element={
        <ProtectedRoute>
          <CreateEvent />
        </ProtectedRoute>
      }
    />
    <Route
      path="/mytickets"
      element={
        <ProtectedRoute>
          <MyTickets />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<div>404 Not Found</div>} />
  </Routes>
);

export default AppRoutes;
