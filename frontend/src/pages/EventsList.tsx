import { useEffect, useState } from "react";
import { listPublishedEvents } from "../lib/events";
import { Link } from "react-router-dom";

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
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPublishedEvents().then(setEvents).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Upcoming Events</h2>
      {loading ? (
        <div>Loading…</div>
      ) : events.length === 0 ? (
        <div className="text-gray-600">No events yet. Create one!</div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => <EventRow key={ev.id} ev={ev} />)}
        </div>
      )}
    </div>
  );
}
