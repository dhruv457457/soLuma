import { useEffect, useState } from "react";
import * as React from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { ensureFirebaseAuth } from "../config/firebase";
import { listPactsByCreator } from "../lib/pacts";
import { Link } from "react-router-dom";

export default function OrganizerDashboard() {
  const { accounts } = useSolanaWallet();
  const [loading, setLoading] = useState(true);
  const [pacts, setPacts] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    ensureFirebaseAuth();
  }, []);

  useEffect(() => {
    (async () => {
      if (!accounts?.[0]) { setLoading(false); return; }
      try {
        const data = await listPactsByCreator(accounts[0]);
        setPacts(data);
      } catch (e: any) {
        setErr(e?.message || "Failed to load pacts");
      } finally {
        setLoading(false);
      }
    })();
  }, [accounts]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Organizer Dashboard</h2>
      {(!pacts || pacts.length === 0) ? (
        <div className="text-gray-600">No pacts yet. <Link className="text-blue-600 underline" to="/create">Create one</Link>.</div>
      ) : (
        <div className="space-y-3">
          {pacts.map((p: any) => (
            <div key={p.id} className="border rounded-lg p-3">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-600">
                Amount/person: <b>{p.amountPerPerson}</b> • Receiver: <span className="font-mono">{p.receiverWallet}</span> • Due: {p.dueDate ? new Date(p.dueDate).toLocaleString() : "-"}
              </div>
              <div className="mt-2">
                <Link className="text-blue-600 underline" to={`/pact/${p.id}`}>Open pact</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
