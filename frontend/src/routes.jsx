import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateEvent from "./pages/CreateEvent";
// import EventDetail from "./pages/EventDetail";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path='/create-event' element={<CreateEvent />} />

    {/* <Route
      path="/create-event"
      element={
        <ProtectedRoute>
          <CreateEvent />
        </ProtectedRoute>
      } */}
    {/* /> */}
    {/* <Route
      path="/event/:id"
      element={
        <ProtectedRoute>
          <EventDetail />
        </ProtectedRoute>
      }
    /> */}
    <Route path="*" element={<div>404 Not Found</div>} />
  </Routes>
);

export default AppRoutes;
