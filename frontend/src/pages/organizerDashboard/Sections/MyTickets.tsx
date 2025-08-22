// src/pages/organizerDashboard/Sections/MyTickets.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useQuery } from "@tanstack/react-query";
import { getMyTickets } from "../../../lib/tickets";
import { getEvent } from "../../../lib/events";
import { ensureFirebaseAuth } from "../../../config/firebase";
import { Card, CardContent, CardFooter, CardHeader } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Calendar, MapPin, TicketX } from "lucide-react";
import type { EventDoc, TicketDoc } from "../../../types/ticketing";

function TicketCard({ ticket, event }: { ticket: TicketDoc; event: EventDoc }) {
  const startDate = new Date(event.startsAt);

  // FIX: Map status to valid Badge variants
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "redeemed") return "secondary"; // 'secondary' is often green in shadcn themes
    if (status === "issued") return "default";
    return "default";
  };

  return (
    <Link to={`/tickets/${ticket.id}`} className="block group">
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-cyan-500/30 transition-colors duration-300 overflow-hidden">
        <CardHeader className="p-0">
          <img
            src={event.bannerUrl || "/placeholder-banner.jpg"}
            alt={`${event.title} banner`}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <h3 className="text-xl font-bold text-white truncate">{event.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>{startDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="truncate">{event.venue || "Venue TBD"}</span>
          </div>
        </CardContent>
        <CardFooter className="bg-black/30 px-6 py-4 flex items-center justify-between">
            <Badge variant={getStatusVariant(ticket.status)}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Badge>
            <span className="text-sm font-semibold text-cyan-400 group-hover:underline">
                View Ticket →
            </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default function MyTickets() {
  // FIX: `useSolanaWallet` does not return `isConnected`. We derive it from `accounts`.
  const { accounts } = useSolanaWallet();
  const wallet = accounts?.[0] || "";
  const isConnected = !!wallet;
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    ensureFirebaseAuth().then(() => setIsAuthReady(true));
  }, []);

  const { data: tickets, isLoading, isError, error } = useQuery({
    queryKey: ['myTickets', wallet],
    queryFn: async () => {
      const fetchedTickets = await getMyTickets(wallet);
      const ticketsWithEvents = await Promise.all(
        fetchedTickets.map(async (ticket) => {
          const eventData = await getEvent(ticket.eventId);
          return eventData ? { ...ticket, event: eventData } : null;
        })
      );
      return ticketsWithEvents.filter(t => t !== null) as (TicketDoc & { event: EventDoc })[];
    },
    enabled: isAuthReady && isConnected,
  });

  if (isLoading || !isAuthReady) {
    return (
      <div className="flex flex-col justify-center items-center text-center p-6 text-gray-400">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>{!isAuthReady ? "Initializing..." : "Loading your tickets..."}</p>
      </div>
    );
  }

  if (!isConnected) {
     return (
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm m-auto">
            <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🎟️</div>
                <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400">Please connect your wallet to view your tickets.</p>
            </CardContent>
        </Card>
     )
  }
  
  if (isError) {
    return (
        <Card className="bg-red-900/30 border-red-500/30 backdrop-blur-sm m-auto">
            <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">😢</div>
                <h3 className="text-xl font-semibold text-red-300 mb-2">Something Went Wrong</h3>
                <p className="text-red-400">{error?.message || "Could not load your tickets."}</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          My Tickets
        </h1>
        <p className="text-gray-400 mt-2">All your event tickets in one place.</p>
      </div>
      <hr className="border-gray-800" />
      
      {tickets && tickets.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
                <TicketX className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Tickets Found</h3>
                <p className="text-gray-400 mb-6">You haven't purchased any tickets yet.</p>
                <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    <Link to="/">Explore Events</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets?.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} event={ticket.event} />
          ))}
        </div>
      )}
    </div>
  );
}