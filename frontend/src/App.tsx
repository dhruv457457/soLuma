import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import EventCheckout from "./pages/EventCheckout";
import TicketView from "./pages/TicketView";

import NotFound from "./pages/NotFound";
import DocumentationPage from "./pages/docSection";
import OrganizerDashboard from "./pages/organizerDashboard/section"

export default function App() {
  return (
    <>
      <Routes>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/e/:id" element={<EventDetails />} />
          <Route path="/checkout/:eventId" element={<EventCheckout />} />
          <Route path="/tickets/:ticketId" element={<TicketView />} />
        </Route>

        <Route path="/dashboard" element={<OrganizerDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
