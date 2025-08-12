import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ensureFirebaseAuth, auth } from "../config/firebase";
import { createEvent } from "../lib/events";
import { useSolanaWallet } from "@web3auth/modal/react/solana";

type Currency = "SOL" | "USDC";

function toLamports(amount: number, currency: Currency) {
  return Math.round(amount * (currency === "SOL" ? 1e9 : 1e6));
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export default function CreateEvent() {
  const { accounts } = useSolanaWallet();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [currency, setCurrency] = useState<Currency>("SOL");
  const [price, setPrice] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("100");
  const [receiverWallet, setReceiverWallet] = useState<string>(accounts?.[0] || "");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    ensureFirebaseAuth();
  }, []);

  useEffect(() => {
    if (accounts?.[0]) setReceiverWallet(accounts[0]);
  }, [accounts]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!title || !startsAt || !price || !receiverWallet) {
      setErr("Please fill all required fields.");
      return;
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setErr("Price must be a positive number.");
      return;
    }
    const capNum = Math.max(1, Number(capacity) || 0);
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setErr("Not signed in. Please refresh and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const id = await createEvent({
        title,
        slug: slugify(title),
        description,
        venue,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: endsAt ? new Date(endsAt).toISOString() : null,
        currency,
        priceLamports: toLamports(priceNum, currency),
        receiverWallet: receiverWallet.trim(),
        capacity: capNum,
        salesCount: 0,
        createdBy: uid,
        status: "published", // simple for MVP
        bannerUrl: "",
      });
      navigate(`/e/${id}`);
    } catch (e: any) {
      setErr(e?.message || "Failed to create event.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Create Event</h2>
      {err && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title*</label>
          <input className="w-full border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Soluma Launch Party" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border rounded px-3 py-2" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell people what to expect..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Starts At*</label>
            <input type="datetime-local" className="w-full border rounded px-3 py-2" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ends At</label>
            <input type="datetime-local" className="w-full border rounded px-3 py-2" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Venue</label>
          <input className="w-full border rounded px-3 py-2" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="123 Main St, City" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Currency*</label>
            <select className="w-full border rounded px-3 py-2" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
              <option value="SOL">SOL</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price ({currency})*</label>
            <input type="number" step="0.000001" min="0.000001" className="w-full border rounded px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={currency === "SOL" ? "0.25" : "25"} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacity*</label>
            <input type="number" min="1" className="w-full border rounded px-3 py-2" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="100" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Receiver Wallet*</label>
          <input className="w-full border rounded px-3 py-2 font-mono" value={receiverWallet} onChange={(e) => setReceiverWallet(e.target.value)} placeholder="Receiver public key" required />
        </div>

        <button type="submit" disabled={submitting} className={`w-full ${submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold py-3 rounded`}>
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
