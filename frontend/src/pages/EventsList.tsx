import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listPublishedEvents } from "../lib/events";
import { Calendar, MapPin, DollarSign } from "lucide-react";

// The EventRow component now has better styling and information
function EventRow({ ev }: { ev: any }) {
  const priceDisplay = ev.currency === "SOL"
    ? `${(ev.priceLamports / 1e9).toFixed(4)} SOL`
    : `${(ev.priceLamports / 1e6).toFixed(2)} USDC`;

  const eventDate = new Date(ev.startsAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Link to={`/e/${ev.id}`} className="block relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
      {/* Event Image */}
      {ev.bannerUrl && (
        <div className="w-full aspect-[2.5/1] overflow-hidden">
          <img
            src={ev.bannerUrl}
            alt={`${ev.title} banner`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="text-xl font-bold text-white leading-tight">
          {ev.title}
        </h3>
        
        {/* Metadata */}
        <div className="flex flex-col space-y-2 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>{ev.venue || "Venue TBA"}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span>{priceDisplay}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function EventsList() {
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ["events", "published"],
    queryFn: listPublishedEvents,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-400 p-8 text-center flex items-center justify-center">
        <div className="flex items-center gap-4 text-lg">
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          Loading events...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black text-center p-8 flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          Failed to load events.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
          Upcoming Events
        </h2>
        {events?.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl">
            <p>No events have been created yet. Be the first!</p>
            <Link 
              to="/create-event" 
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300"
            >
              Create Event
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map((ev) => <EventRow key={ev.id} ev={ev} />)}
          </div>
        )}
      </div>
    </div>
  );
}