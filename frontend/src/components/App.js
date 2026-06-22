import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/room/:roomCode" element={<Room />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
