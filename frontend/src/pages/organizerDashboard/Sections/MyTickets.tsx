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
  const statusMap = {
    redeemed: { label: "Redeemed", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    issued: { label: "Issued", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
    expired: { label: "Expired", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  };
  const status = statusMap[ticket.status] || { label: ticket.status, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };

  return (
    <Link to={`/dashboard/tickets/${ticket.id}`} className="group block relative bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-md border border-gray-700/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-cyan-500/30 transition-all duration-300">
      {/* Banner Image */}
      <div className="relative w-full aspect-[2.2/1] overflow-hidden">
        {isExpired && (
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-400/10 text-red-300 border border-red-400/10 shadow-sm backdrop-blur-md">Expired</span>
          </div>
        )}
        {event.bannerUrl ? (
          <>
            <img
              src={event.bannerUrl}
              alt={`${event.title} banner`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 flex items-center justify-center">
            <div className="text-gray-500 text-sm sm:text-lg font-medium">No Image</div>
          </div>
        )}
      </div>
      {/* Card Content */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
          {event.title}
        </h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2 text-gray-300">
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-cyan-500/20 rounded-full flex-shrink-0">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              </div>
              <span className="text-xs sm:text-sm font-medium">
                {startDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">
                {startDate.toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-orange-500/20 rounded-full flex-shrink-0">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
            </div>
            <span className="text-xs sm:text-sm font-medium truncate flex-1">
              {event.venue || "Venue TBA"}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-700/50">
            <span className="text-gray-400 text-xs sm:text-sm">Ticket Status</span>
            <span className={`text-xs sm:text-sm font-medium rounded-full px-2 py-1 border ${status.color}`}>{status.label}</span>
          </div>
        </div>
        {/* Action Button */}
        <div className="flex gap-2 mt-3 sm:mt-4">
          <Button
            size="sm"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-4 text-white rounded-md cursor-pointer"
            asChild
          >
            <Link to={`/dashboard/tickets/${ticket.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
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
    <div className="min-h-screen bg-black text-white sm:p-2 lg:p-4 relative">
      <div className="max-w-7xl mx-auto py-2 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
            My Tickets
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-16">
            Here are all the event tickets you've collected.
          </p>
        </div>

        {/* Loading State */}
        {(!isAuthReady || isLoading) && (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="flex items-center gap-3 text-base sm:text-lg">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              Loading your tickets...
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
          <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] w-full px-4">
            <div className="mb-4 sm:mb-6 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                <TicketX className="w-6 h-6 sm:w-10 sm:h-10 text-cyan-400" />
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
              No Tickets Found
            </h3>
            <p className="text-gray-400 mb-6 sm:mb-8 text-center text-sm sm:text-base max-w-sm">
              You haven't purchased any tickets yet.
            </p>
            <div className="relative group w-full max-w-xs sm:max-w-sm h-12 sm:h-14 mb-2">
              <div className="absolute transition-all duration-200 rounded-xl sm:rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              <Button
                asChild
                size="lg"
                className="relative inline-flex items-center justify-center w-full h-full px-6 sm:px-8 py-3 text-sm sm:text-base font-normal text-white bg-black border border-transparent rounded-xl sm:rounded-full"
              >
                <Link to="/dashboard/explore">Explore Events</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Tickets Grid */}
        {isConnected && isAuthReady && tickets && tickets.length > 0 && !isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
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