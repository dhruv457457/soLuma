// src/pages/EventDetails.tsx

import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent } from "../lib/events";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"; // Assuming shadcn/ui components
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Calendar, MapPin, Users, Wallet } from "lucide-react";

// Helper function to format wallet addresses
const formatWallet = (address: string) => {
  if (!address) return "N/A";
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

// Helper function to format dates
const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
        date: date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true }),
    }
}

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: ev, isLoading, isError } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEvent(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 bg-black">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
        <p>Loading Event...</p>
      </div>
    );
  }

  if (isError) return <div className="p-6 bg-black text-red-400 text-center">Failed to load event.</div>;
  if (!ev) return <div className="p-6 bg-black text-gray-400 text-center">Event not found.</div>;

  const priceText = ev.currency === "SOL"
      ? `${(ev.priceLamports / 1e9).toFixed(4)} SOL`
      : `${(ev.priceLamports / 1e6).toFixed(2)} USDC`;

  const ticketsSold = ev.salesCount;
  const capacity = ev.capacity;
  const ticketsRemaining = capacity - ticketsSold;
  const salesProgress = capacity > 0 ? (ticketsSold / capacity) * 100 : 0;
  
  const start = formatDateTime(ev.startsAt);
  const end = ev.endsAt ? formatDateTime(ev.endsAt) : null;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Top left: Back button and event name */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            className="bg-gray-900/70 border-gray-700 text-white hover:bg-gray-800 hover:text-cyan-400 px-4 py-2 rounded-lg cursor-pointer hidden lg:block"
            onClick={() => navigate(-1)}
          >
            &#8592; Back
          </Button>
          <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {ev.title}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Sticky Details & Ticket Card) */}
          <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8 self-start">
             {ev.bannerUrl && (
                <img src={ev.bannerUrl} alt={`${ev.title} banner`} className="w-full aspect-square object-cover rounded-2xl lg:hidden" />
             )}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 mt-1 text-cyan-400" />
                  <div>
                    <p className="font-semibold">{start.date}</p>
                    <p className="text-sm">{start.time}{end ? ` - ${end.time}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 mt-1 text-cyan-400" />
                  <div>
                    <p className="font-semibold">{ev.venue || "Venue To Be Announced"}</p>
                     {ev.venue && !ev.venue.startsWith('http') && <p className="text-xs text-gray-500">Physical Event</p>}
                     {ev.venue && ev.venue.startsWith('http') && <p className="text-xs text-gray-500">Virtual Event</p>}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Wallet className="w-5 h-5 mt-1 text-cyan-400" />
                  <div>
                    <p className="font-semibold">Organizer</p>
                    <p className="text-sm font-mono">{formatWallet(ev.createdBy)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h2 className="text-3xl font-bold text-center">{priceText}</h2>
                <div>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Tickets Sold</span>
                        <span>{ticketsSold} / {capacity}</span>
                    </div>
                    <Progress value={salesProgress} className="h-2 bg-gray-700" />
                    <p className="text-xs text-right mt-1 text-cyan-400">{ticketsRemaining} remaining</p>
                </div>
                <Button 
                    onClick={() => navigate(`/checkout/${ev.id}`)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-6 text-lg font-bold"
                    disabled={ticketsRemaining <= 0}
                >
                  {ticketsRemaining > 0 ? "Buy Ticket" : "Sold Out"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Banner, Title & Description) */}
          <div className="lg:col-span-2 space-y-6">
            {ev.bannerUrl && (
                <img src={ev.bannerUrl} alt={`${ev.title} banner`} className="w-full aspect-video object-cover rounded-2xl hidden lg:block" />
            )}
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {ev.title}
            </h1>
            {ev.description && (
              <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
                <p>{ev.description}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}