// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WalletBar from "./components/WalletBar";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import CreatePact from "./pages/CreatePact";
import NotFound from "./pages/NotFound";
import PactDetails from "./pages/PactDetails";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import ParticipantPay from "./pages/ParticipantPay";
import MyPacts from "./pages/MyPacts";
const App: React.FC = () => {
  return (
    <Router>
      <WalletBar /> {/* Global wallet connect bar, always visible */}
      <NavBar />
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/create" element={<CreatePact />} />
  <Route path="/pact/:id" element={<PactDetails />} />
  <Route path="/organizer" element={<OrganizerDashboard />} />
  <Route path="*" element={<NotFound />} />
  <Route path="/pay/:pactId/:index" element={<ParticipantPay />} />  {/* NEW */}
  <Route path="/my" element={<MyPacts />} />  {/* NEW */}
</Routes>

    </Router>
  );
};

export default App;
