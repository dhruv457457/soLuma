import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { getMyTickets } from "../lib/tickets";
import { getEvent } from "../lib/events";
import { ensureFirebaseAuth } from "../config/firebase";
import type { EventDoc, TicketDoc } from "../types/ticketing";

function TicketRow({ ticket, event }: { ticket: TicketDoc; event: EventDoc | null }) {
  if (!event) return null;
  return (
    <Link to={`/tickets/${ticket.id}`} className="block border rounded-lg p-4 hover:bg-gray-50">
      <div className="text-lg font-semibold">{event.title}</div>
      <div className="text-sm text-gray-600">
        Ticket ID: {ticket.id} • Status: {ticket.status}
      </div>
    </Link>
  );
}

export default function MyTickets() {
  const { accounts } = useSolanaWallet();
  const wallet = accounts?.[0] || "";

  console.log("Wallet accounts:", accounts);
  console.log("Using wallet address:", wallet || 'No wallet connected');
  console.log("Is wallet connected:", !!wallet);

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<(TicketDoc & { event: EventDoc | null })[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Wait for Firebase auth to be ready
  useEffect(() => {
    (async () => {
      try {
        await ensureFirebaseAuth();
        setIsAuthReady(true);
      } catch (e: any) {
        setError(e.message || "Auth failed.");
        setLoading(false);
      }
    })();
  }, []);

  // Step 2: Load tickets once auth is ready and wallet is connected
  useEffect(() => {
    // Only proceed if auth is ready and a wallet is connected
    if (!isAuthReady) {
      console.log("Auth not ready yet");
      return;
    }

    if (!wallet) {
      console.warn("No wallet connected. Cannot fetch tickets.");
      setLoading(false);
      setError("Please connect your wallet to view tickets.");
      return;
    }

    setLoading(true);
    setError(null);

    const fetchTickets = async () => {
      try {
        const fetchedTickets = await getMyTickets(wallet);
        
        // Fetch event details for each ticket, as the backend is not doing it
        const ticketsWithEvents = await Promise.all(
          fetchedTickets.map(async (t) => {
            const eventData = await getEvent(t.eventId);
            return { ...t, event: eventData };
          })
        );
        setTickets(ticketsWithEvents);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [isAuthReady, wallet]);

  if (!isAuthReady) {
    return <div className="p-6">Initializing authentication...</div>;
  }

  if (loading) return <div className="p-6">Loading tickets...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <>
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Tickets</h2>
      {tickets.length === 0 ? (
        <div className="text-gray-600">You don't have any tickets yet.</div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <TicketRow key={t.id} ticket={t} event={t.event} />
          ))}
        </div>
      )}
    </div>
    </>
  );
}