import React, { useEffect, useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { ensureFirebaseAuth } from "../config/firebase";
import { createPact } from "../lib/pacts";
import { useNavigate } from "react-router-dom";

export default function CreatePact() {
  const { accounts } = useSolanaWallet();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [due, setDue] = useState("");
  const [participantsText, setParticipantsText] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Invisible: ensures Firestore calls are allowed (anon auth)
    ensureFirebaseAuth();
  }, []);

  const parseParticipants = () => {
    // Supports: newline, comma, or whitespace separated emails / wallets
    const items = participantsText
      .split(/\n|,|\s/)
      .map((s) => s.trim())
      .filter(Boolean);

    return items.map((v) => (v.includes("@") ? { email: v } : { wallet: v }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !amount || !receiver || !due) {
      setError("Please fill all required fields.");
      return;
    }

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    const participants = parseParticipants();
    if (participants.length === 0) {
      setError("Add at least one participant (email or wallet).");
      return;
    }

    setSubmitting(true);
    try {
      const pactId = await createPact({
        name,
        amountPerPerson: amountNum,
        receiverWallet: receiver,
        dueDate: new Date(due).toISOString(),
        createdBy: accounts?.[0],
        participants,
      });

      navigate(`/pact/${pactId}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create pact.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">Create Pact</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pact Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="August Rent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount per Person
            </label>
            <input
              type="number"
              step="0.0001"
              min="0.00001"
              className="w-full border rounded px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 0.5"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Receiver Wallet
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="Receiver public key"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Participants (emails or wallets)
          </label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={5}
            value={participantsText}
            onChange={(e) => setParticipantsText(e.target.value)}
            placeholder={'one per line (email or wallet)\nor comma/space separated'}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full ${
            submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold py-3 rounded`}
        >
          {submitting ? "Creating..." : "Create Pact"}
        </button>
      </form>
    </div>
  );
}
