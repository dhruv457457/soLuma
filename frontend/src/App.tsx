import { Routes, Route } from "react-router-dom";
// import NavBar from "./components/NavBar";
import NavBar from "./layout/Navbar";
import Home from "./pages/Home";
import EventsList from "./pages/EventsList";
import EventDetails from "./pages/EventDetails";
import EventCheckout from "./pages/EventCheckout";
import MyTickets from "./pages/MyTickets";
import TicketView from "./pages/TicketView";
import Scanner from "./pages/Scanner";
// import CreateEvent from "./pages/CreateEvent";
import CreateEvent from "./pages/CreateEvent";
import OrgEventDashboard from "./pages/OrgEventDashboard";
import NotFound from "./pages/NotFound";
import DocumentationPage from "./pages/docSection"

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/docs" element={<DocumentationPage />} />

        <Route path="/events" element={<EventsList />} />
        <Route path="/e/:id" element={<EventDetails />} />
        <Route path="/checkout/:eventId" element={<EventCheckout />} />
        <Route path="/tickets" element={<MyTickets />} />
        <Route path="/tickets/:ticketId" element={<TicketView />} />
        <Route path="/scan" element={<Scanner />} />
        <Route path="/org/events" element={<CreateEvent />} />
        <Route path="/org/events/:id" element={<OrgEventDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
