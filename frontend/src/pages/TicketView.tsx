// src/pages/TicketView.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { getTicket } from "../lib/tickets";
import { getEvent } from "../lib/events";
import type { EventDoc, TicketDoc } from "../types/ticketing";

export default function TicketView() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<TicketDoc | null>(null);
  const [event, setEvent] = useState<EventDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    if (!ticketId) return;
    const fetchTicketData = async () => {
      try {
        const ticketDoc = await getTicket(ticketId);
        const eventDoc = await getEvent(ticketDoc.eventId);
        setTicket(ticketDoc);
        setEvent(eventDoc);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
        else setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchTicketData();
  }, [ticketId]);

  // Generate **static** QR (single per ticket)
  useEffect(() => {
    if (!ticket) return;
    setQrValue(`${window.location.origin}/scan?ticketId=${ticket.id}`);
    // For extra security:
    // setQrValue(`${window.location.origin}/scan?ticketId=${ticket.id}&secret=${ticket.qrTokenHash}`);
  }, [ticket]);

  if (loading) return <div className="p-6">Loading ticket...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!ticket || !event) return <div className="p-6">Ticket not found.</div>;

  return (
    <div className="max-w-md mx-auto p-6 text-center border rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-semibold text-blue-700">{event.title}</h2>
      <p className="text-sm text-gray-600 mb-4">Ticket ID: {ticket.id}</p>
      <div className="bg-white p-4 inline-block">
        <QRCode value={qrValue} size={256} />
      </div>
      <p className="mt-4 text-sm text-gray-500">
        This QR code is your unique ticket. Show this at entry.
      </p>
    </div>
  );
}
