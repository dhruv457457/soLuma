import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useWeb3Auth } from "@web3auth/modal/react";

import { ensureFirebaseAuth } from "../lib/firebase";
import { listenPact, markParticipantPaid } from "../lib/pacts";
import { makePayURL } from "../lib/solanapay";
import { createConnection } from "../config/solana";
import { payWithConnectedWalletSDK } from "../lib/pay-desktop";

import PaymentQR from "../components/PaymentQR";

type Participant = { email?: string; wallet?: string; reference?: string; paid?: boolean };
type PactDoc = {
  id: string;
  name: string;
  amountPerPerson: number;
  receiverWallet: string;
  dueDate: string;
  createdBy?: string;
  participants: Participant[];
  createdAt?: any;
};

export default function PactDetails() {
  const { id } = useParams();

  const wallet = useSolanaWallet();
  const { accounts } = wallet;
  const connected = !!accounts?.[0];
  const { provider, status } = useWeb3Auth();

  const [pact, setPact] = useState<PactDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    ensureFirebaseAuth();
  }, []);

  useEffect(() => {
    if (!id) return;
    const unsub = listenPact(id, (doc) => {
      setPact(doc as PactDoc);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [id]);

  const unpaid = useMemo(
    () => (pact?.participants || []).map((p, i) => ({ ...p, i })).filter((p) => !p.paid),
    [pact]
  );
  const paid = useMemo(
    () => (pact?.participants || []).map((p, i) => ({ ...p, i })).filter((p) => p.paid),
    [pact]
  );

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!pact) return <div className="p-6 text-red-600">Pact not found.</div>;

  // ✅ New: capability-based embedded check (works on mobile too)
  const hasEmbedded =
    !!provider && typeof (provider as any).request === "function" && connected;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-semibold text-blue-700 mb-1">{pact.name}</h2>
      <div className="text-sm text-gray-600 mb-6">
        Receiver: <span className="font-mono">{pact.receiverWallet}</span> •
        {" "}Amount/Person: <b>{pact.amountPerPerson}</b> • Due:{" "}
        {new Date(pact.dueDate).toLocaleString()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-medium mb-3">Unpaid ({unpaid.length})</h3>
          <div className="space-y-4">
            {unpaid.map((p) => {
              const who = p.email || p.wallet || `P${p.i + 1}`;
              const url = makePayURL({
                recipient: pact.receiverWallet,
                amount: pact.amountPerPerson,
                reference: p.reference || "",
                label: pact.name,
                message: `Payment for ${who}`,
              }).toString();

              const showEmbeddedBtn = hasEmbedded && !!p.reference;

              return (
                <div key={p.i} className="border rounded-lg p-3 flex gap-3 items-center">
                  <PaymentQR url={url} />
                  <div className="flex-1 text-sm">
                    <div className="mb-1">
                      <b>Participant:</b> {who}
                    </div>
                    <div className="break-all text-gray-600">ref: {p.reference || "-"}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Open link
                      </a>
                      <button
                        className="text-xs px-2 py-1 border rounded"
                        onClick={() => navigator.clipboard.writeText(url)}
                      >
                        Copy URL
                      </button>
                      <button
                        className="text-xs px-2 py-1 border rounded"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            window.location.origin + `/pay/${pact.id}/${p.i}`
                          )
                        }
                      >
                        Copy participant page
                      </button>

                      {showEmbeddedBtn && (
                        <button
                          type="button"
                          className="text-xs px-2 py-1 rounded bg-blue-600 text-white"
                          onClick={async () => {
                            try {
                              if (!hasEmbedded) throw new Error("Connect embedded wallet first");
                              if (!provider || typeof (provider as any).request !== "function") {
                                console.log("Web3Auth provider missing. Debug:", { status, provider, wallet });
                                throw new Error("Embedded wallet not connected");
                              }

                              const signer = provider;
                              const conn = await createConnection();
                              console.log("Using RPC:", import.meta.env.VITE_RPC);
                              console.log("provider.rpcTarget:", (provider as any)?.rpcTarget);

                              const sig = await payWithConnectedWalletSDK({
                                conn,
                                signer,
                                payer: accounts![0],
                                recipient: pact.receiverWallet,
                                amount: pact.amountPerPerson,
                                reference: p.reference!,
                              });
                              await markParticipantPaid(pact.id, p.i, sig);
                              alert("Paid!\n" + sig);
                            } catch (e: any) {
                              alert(e.message || "Payment failed");
                            }
                          }}
                        >
                          Pay with connected wallet
                        </button>
                      )}

                      <button
                        className="text-xs px-2 py-1 border rounded"
                        onClick={() => markParticipantPaid(pact.id, p.i)}
                      >
                        Mark Paid (manual)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {unpaid.length === 0 && <div className="text-sm text-green-700">All paid 🎉</div>}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Paid ({paid.length})</h3>
          <div className="space-y-2">
            {paid.map((p) => (
              <div key={p.i} className="border rounded-lg p-3 text-sm">
                <div>
                  <b>Participant:</b> {p.email || p.wallet || `P${p.i + 1}`}
                </div>
                <div className="text-gray-600">Status: ✅ Paid</div>
              </div>
            ))}
            {paid.length === 0 && (
              <div className="text-sm text-gray-600">No payments yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
