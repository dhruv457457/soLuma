// src/pages/EventDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ensureFirebaseAuth } from "../config/firebase";
import { getEvent } from "../lib/events";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ev, setEv] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    ensureFirebaseAuth();
    if (!id) return;
    (async () => {
      try {
        const doc = await getEvent(id);
        setEv(doc);
      } catch (e: any) {
        setErr(e?.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!ev) return <div className="p-6">Event not found.</div>;

  const price =
    ev.currency === "SOL"
      ? `${(ev.priceLamports / 1e9).toFixed(4)} SOL`
      : `${(ev.priceLamports / 1e6).toFixed(2)} USDC`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Banner */}
      {ev.bannerUrl ? (
        <img src={ev.bannerUrl} alt="" className="w-full h-56 object-cover rounded-xl mb-4" />
      ) : null}

      <h1 className="text-2xl font-semibold text-gray-900">{ev.title}</h1>
      <div className="text-sm text-gray-600 mt-1">
        {new Date(ev.startsAt).toLocaleString()} • {ev.venue || "TBA"}
      </div>

      {ev.description && (
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">{ev.description}</p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <span className="text-xl font-semibold">{price}</span>
        <button
          onClick={() => navigate(`/checkout/${ev.id}`)}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Buy / Checkout
        </button>
      </div>
    </div>
  );
}
