import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listPublishedEvents } from "../lib/events";

function EventRow({ ev }: { ev: any }) {
  return (
    <Link to={`/e/${ev.id}`} className="block border rounded-lg p-4 hover:bg-gray-50">
      <div className="text-lg font-semibold">{ev.title}</div>
      <div className="text-sm text-gray-600">
        {ev.venue || "TBA"} • {new Date(ev.startsAt).toLocaleString()} • {ev.currency} •
        {" "}price: {ev.currency === "SOL" ? (ev.priceLamports / 1e9).toFixed(4) : (ev.priceLamports / 1e6).toFixed(2)}
      </div>
    </Link>
  );
}

export default function EventsList() {
  // useQuery will automatically manage fetching, caching, and background refetching
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ["events", "published"],
    queryFn: listPublishedEvents,
  });

  if (isLoading) return <div className="p-6">Loading events...</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load events.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Upcoming Events</h2>
      {events?.length === 0 ? (
        <div className="text-gray-600">No events yet. Create one!</div>
      ) : (
        <div className="space-y-3">
          {events?.map((ev) => <EventRow key={ev.id} ev={ev} />)}
        </div>
      )}
    </div>
  );
}