// src/pages/organizerDashboard/Sections/DashboardTicketView.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { getTicket } from "../../../lib/tickets";
import { getEvent } from "../../../lib/events";
import type { EventDoc, TicketDoc } from "../../../types/ticketing";
import { Button } from "../../../ui/button";
import { ArrowLeft, Calendar, Clock, Ticket, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardTicketView() {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-lg">
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          Loading ticket...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-red-900/50 border border-red-500/20 text-red-400 p-6 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          Error: {error}
        </div>
      </div>
    );
  }

  if (!ticket || !event) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ticket not found</h3>
          <p className="text-gray-400">The requested ticket could not be located.</p>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.startsAt);
  const statusMap = {
    redeemed: { label: "Redeemed", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    issued: { label: "Issued", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
    expired: { label: "Expired", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  };
  const status = statusMap[ticket.status] || { label: ticket.status, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <Link to="/dashboard/tickets">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Tickets
            </Link>
          </Button>
        </div>

        {/* Event Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{event.title}</h1>
          <span className={`text-sm font-medium rounded-full px-3 py-1 border ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* QR Code Section */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
            <h2 className="text-lg font-semibold text-white mb-4">Your QR Code</h2>
            <div className="bg-white p-6 rounded-lg inline-block">
              <QRCode value={qrValue} size={200} />
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Show this QR code at the event entrance
            </p>
          </div>

          {/* Ticket Information */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Ticket Information</h2>
            <div className="space-y-4">
              {/* Ticket ID */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-full">
                    <Ticket className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-gray-300">Ticket ID</span>
                </div>
                <span className="text-white font-mono text-sm">{ticket.id}</span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/20 rounded-full">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">Date</span>
                </div>
                <span className="text-white">{startDate.toLocaleDateString()}</span>
              </div>

              {/* Time */}
              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">Time</span>
                </div>
                <span className="text-white">{startDate.toLocaleTimeString()}</span>
              </div>

              {/* Venue (if available) */}
              {event.venue && (
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-500/20 rounded-full">
                      <div className="w-4 h-4 text-orange-400">📍</div>
                    </div>
                    <span className="text-gray-300">Venue</span>
                  </div>
                  <span className="text-white text-right max-w-xs truncate">{event.venue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Download/Share Options */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Actions</h2>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  // Create a canvas to download QR code
                  const canvas = document.createElement('canvas');
                  const qrCanvas = document.querySelector('canvas');
                  if (qrCanvas) {
                    canvas.width = qrCanvas.width;
                    canvas.height = qrCanvas.height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(qrCanvas, 0, 0);
                    const link = document.createElement('a');
                    link.download = `ticket-${ticket.id}.png`;
                    link.href = canvas.toDataURL();
                    link.click();
                  }
                }}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
              <Button
                onClick={() => {
                  navigator.share?.({
                    title: `Ticket for ${event.title}`,
                    text: `My ticket for ${event.title} on ${startDate.toLocaleDateString()}`,
                    url: window.location.href
                  }).catch(() => {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(window.location.href);
                  });
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              >
                Share Ticket
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 