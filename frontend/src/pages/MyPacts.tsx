// src/pages/MyPacts.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { ensureFirebaseAuth } from "../config/firebase";
import {
  listPactsForWallet,
  findParticipantIndexByWallet,
} from "../lib/pacts";

type PactDoc = {
  id: string;
  name: string;
  amountPerPerson: number;
  receiverWallet: string;
  dueDate: string;
  createdBy?: string;
  participants: Array<{ wallet?: string; email?: string; paid?: boolean; paidTx?: string }>;
  createdAt?: any;
  participantWallets?: string[];
};

export default function MyPacts() {
  const { accounts } = useSolanaWallet();
  const wallet = accounts?.[0] || "";

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pacts, setPacts] = useState<PactDoc[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // 1) Wait for Firebase auth (anon in dev) BEFORE any Firestore reads
  useEffect(() => {
    (async () => {
      try {
        await ensureFirebaseAuth();
        setReady(true);
      } catch (e: any) {
        setErr(e?.message || "Auth failed");
        setLoading(false);
      }
    })();
  }, []);

  // 2) Load pacts once auth is ready and wallet is connected
  useEffect(() => {
    if (!ready) return;
    if (!wallet) { setLoading(false); return; }

    (async () => {
      setLoading(true);
      try {
        const indexed = await listPactsForWallet(wallet);
        setPacts(indexed as any);
      } catch (e: any) {
        setErr(e?.message || "Failed to load pacts");
      } finally {
        setLoading(false);
      }
    })();
  }, [ready, wallet]);

  const rows = useMemo(() => {
    return pacts.map((p) => {
      const idx = findParticipantIndexByWallet(p, wallet);
      const me = idx >= 0 ? p.participants[idx] : null;
      const paidCount = (p.participants || []).filter((x) => x.paid).length;
      const total = (p.participants || []).length;
      return { pact: p, idx, me, paidCount, total };
    });
  }, [pacts, wallet]);

  if (!wallet) {
    return <div className="p-6">Please connect your wallet first.</div>;
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">My Pacts</h2>

      {rows.length === 0 ? (
        <div className="text-gray-600">No pacts found for this wallet.</div>
      ) : (
        <div className="space-y-3">
          {rows.map(({ pact, idx, me, paidCount, total }) => {
            const myStatus = me?.paid ? "✅ Paid" : "❌ Unpaid";
            const myLink = idx >= 0 ? `/pay/${pact.id}/${idx}` : null;

            return (
              <div key={pact.id} className="border rounded-lg p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{pact.name}</div>
                    <div className="text-sm text-gray-600">
                      Amount/person: <b>{pact.amountPerPerson}</b> •{" "}
                      Receiver: <span className="font-mono">{pact.receiverWallet}</span> •{" "}
                      Due: {pact.dueDate ? new Date(pact.dueDate).toLocaleString() : "-"}
                    </div>
                    <div className="text-sm mt-1">
                      Group status: {paidCount}/{total} paid
                    </div>
                    <div className="text-sm">Your status: {myStatus}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link className="text-blue-600 underline" to={`/pact/${pact.id}`}>
                      View pact
                    </Link>
                    {myLink && (
                      <Link className="text-blue-600 underline" to={myLink}>
                        Pay now
                      </Link>
                    )}
                  </div>
                </div>

                {myLink && !me?.paid && (
                  <div className="mt-2">
                    <button
                      className="text-xs px-2 py-1 border rounded"
                      onClick={() =>
                        navigator.clipboard.writeText(window.location.origin + myLink)
                      }
                    >
                      Copy my payment link
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
