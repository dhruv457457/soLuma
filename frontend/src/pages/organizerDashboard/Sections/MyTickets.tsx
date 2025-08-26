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
import { Calendar, MapPin, TicketX, Wallet, Clock, ArrowRight } from "lucide-react";
import type { EventDoc, TicketDoc } from "../../../types/ticketing";

function TicketCard({ ticket, event }: { ticket: TicketDoc; event: EventDoc }) {
  const startDate = new Date(event.startsAt);
  const isExpired = startDate < new Date();

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "redeemed") return "secondary";
    if (status === "issued") return "default";
    if (status === "expired") return "destructive";
    return "default";
  };

  return (
    <Link to={`/tickets/${ticket.id}`} className="block group">
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-gray-900/70 transition-all duration-300 overflow-hidden h-full flex flex-col">
        <CardHeader className="p-0 relative">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={event.bannerUrl || "/placeholder-banner.jpg"}
              alt={`${event.title} banner`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          {isExpired && (
            <div className="absolute top-3 right-3 z-20">
              <Badge variant="destructive" className="text-xs">
                Expired
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6 space-y-4 flex-grow">
          <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
            {event.title}
          </h3>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>{startDate.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>{startDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="truncate">{event.venue || "Venue TBD"}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-black/40 px-6 py-4 flex items-center justify-between border-t border-gray-800/50">
          <Badge variant={getStatusVariant(ticket.status)} className="text-xs">
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </Badge>
          <div className="flex items-center gap-1 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm overflow-hidden">
          <div className="h-48 bg-gray-800/50 animate-pulse"></div>
          <CardContent className="p-6 space-y-4">
            <div className="h-6 w-3/4 bg-gray-800/50 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-800/30 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-800/30 rounded animate-pulse"></div>
            </div>
          </CardContent>
          <CardFooter className="bg-black/40 px-6 py-4 border-t border-gray-800/50 flex items-center justify-between">
            <div className="h-5 w-20 bg-gray-800/50 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-800/30 rounded animate-pulse"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function WalletNotConnectedState() {
  return (
    <div className="flex justify-center items-center h-full">
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm max-w-lg w-full">
        <CardContent className="p-10 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Connect Your Wallet</h3>
            <p className="text-gray-400 text-lg">
              To see your tickets, please connect your Solana wallet.
            </p>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => window.dispatchEvent(new Event('connect-wallet'))}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
            >
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MyTickets() {
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

  // UI Layout similar to EventsList
  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            My Tickets
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Here are all the event tickets you've collected.
          </p>
        </div>

        {/* Loading State */}
        {(!isAuthReady || isLoading) && (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="flex items-center gap-4 text-lg">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              Loading tickets...
            </div>
          </div>
        )}

        {/* Wallet Not Connected */}
        {!isConnected && isAuthReady && (
          <WalletNotConnectedState />
        )}

        {/* Error State */}
        {isError && (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="bg-red-900/50 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              Error: {error?.message || "Failed to load tickets."}
            </div>
          </div>
        )}

        {/* No Tickets State */}
        {isConnected && isAuthReady && tickets && tickets.length === 0 && !isLoading && (
          <div className="max-w-md mx-auto">
            <div className="p-8 text-center bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-md border border-gray-700/40 rounded-3xl shadow-xl">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <TicketX className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Tickets Found
              </h3>
              <p className="text-gray-400 mb-6">
                You haven't purchased any tickets yet.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                <Link to="/dashboard/explore">Explore Events</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Tickets Grid */}
        {isConnected && isAuthReady && tickets && tickets.length > 0 && !isLoading && (
          <>
            {/* Results Count */}
            <div className="text-center mb-6">
              <p className="text-gray-400">
                Showing {tickets.length} ticket{tickets.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} event={ticket.event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}