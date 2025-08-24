// src/App.tsx

import { Routes, Route, useNavigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import EventCheckout from "./pages/EventCheckout";
import TicketView from "./pages/TicketView";
import NotFound from "./pages/NotFound";
import DocumentationPage from "./pages/docSection";

// Import all dashboard components that will become pages
import OrganizerDashboard from "./pages/organizerDashboard/section";
// import { DashboardOverview } from "./pages/organizerDashboard/Sections/dashboard-overview";
import CreateEvent from "./pages/organizerDashboard/Sections/create-event";
import { MyEvents } from "./pages/organizerDashboard/Sections/my-events";
import MyTickets from "./pages/organizerDashboard/Sections/MyTickets";
import Scanner from "./pages/organizerDashboard/Sections/Scanner";
import EventsList from "./pages/organizerDashboard/Sections/EventsList";
import { AttendeeManagement } from "./pages/organizerDashboard/Sections/attendee-management";
import { Revenue } from "./pages/organizerDashboard/Sections/revenue";
import { Settings } from "./pages/organizerDashboard/Sections/settings";
import { MergedDashboard } from "./pages/organizerDashboard/Sections/profile";

export default function App() {
  // The navigate function will be passed down to handle programmatic navigation
  const navigate = useNavigate();

  const handleManageEvent = (section: string, eventId?: string) => {
    if (section === "attendee-management" && eventId) {
      navigate(`/dashboard/events/${eventId}/attendees`);
    }
  };

  return (
    <Routes>
      {/* --- Public Routes with Main Navbar --- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/checkout/:eventId" element={<EventCheckout />} />
        <Route path="/tickets/:ticketId" element={<TicketView />} />
      </Route>

      {/* --- Organizer Dashboard Routes with its own Sidebar --- */}
      <Route path="/dashboard" element={<OrganizerDashboard />}>
        {/* <Route index element={<DashboardOverview />} /> */}
        <Route path="profile" element={<MergedDashboard />} />
        <Route path="tickets" element={<MyTickets />} />
        <Route path="explore" element={<EventsList />} />
        {/* FIX: Pass the navigation handler to MyEvents */}
        <Route path="events" element={<MyEvents setActiveSection={handleManageEvent} />} />
        <Route path="events/new" element={<CreateEvent />} />
        <Route 
          path="events/:eventId/attendees" 
          element={
            <AttendeeManagement 
              setActiveSection={handleManageEvent} 
              eventId={null} // This will be overridden by the URL param in the component
            />
          } 
        />
        <Route path="scanner" element={<Scanner />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* --- Catch-all 404 Route --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}