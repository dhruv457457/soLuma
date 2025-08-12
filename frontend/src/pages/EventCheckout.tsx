// src/pages/EventCheckout.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Keypair } from "@solana/web3.js";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useWeb3Auth } from "@web3auth/modal/react";

import { ensureFirebaseAuth } from "../config/firebase";
import { getEvent } from "../lib/events";
import { makePayURL, makeCompatURL } from "../lib/solanapay";
import { createConnection, CLUSTER } from "../config/solana";
import { payWithConnectedWalletSDK } from "../lib/pay-desktop";
import PaymentQR from "../components/PaymentQR";

type EventDoc = {
  id: string;
  title: string;
  description?: string;
  venue?: string;
  startsAt: string;
  currency: "SOL" | "USDC";
  priceLamports: number;
  receiverWallet: string;
};

export default function EventCheckout() {
  const { eventId } = useParams<{ eventId: string }>();

  const { accounts } = useSolanaWallet();
  const { provider } = useWeb3Auth();
  const connected = !!accounts?.[0];

  const [ev, setEv] = useState<EventDoc | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    ensureFirebaseAuth();
    if (!eventId) return;
    (async () => {
      try {
        const doc = await getEvent(eventId);
        setEv(doc as any);
      } catch (e: any) {
        setErr(e?.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  // one-time unique reference for this checkout session
  const reference = useMemo(() => Keypair.generate().publicKey.toBase58(), []);
  const isNonMainnet = CLUSTER !== "mainnet-beta";

  const amountSol = useMemo(() => {
    if (!ev) return 0;
    if (ev.currency !== "SOL") return 0;
    const per = ev.priceLamports / 1e9;
    return Number((per * qty).toFixed(9));
  }, [ev, qty]);

  // Build Solana Pay URLs (nullable until event is ready)
  const payUrl = useMemo<null | { strict: string; compat: string; total: number }>(() => {
    if (!ev) return null;
    const per = ev.currency === "SOL" ? ev.priceLamports / 1e9 : ev.priceLamports / 1e6;
    const total = per * qty;

    const strict = makePayURL({
      recipient: ev.receiverWallet,
      amount: total,
      reference,
      label: ev.title,
      message: `Ticket purchase x${qty}`,
      cluster: CLUSTER as any,
    }).toString();

    const compat = makeCompatURL({
      recipient: ev.receiverWallet,
      amount: total,
      label: ev.title,
      message: `Ticket purchase x${qty}`,
      cluster: CLUSTER as any,
    }).toString();

    return { strict, compat, total };
  }, [ev, qty, reference]);

  async function payWithConnectedWallet() {
    try {
      if (!ev) throw new Error("Event not loaded");
      if (ev.currency !== "SOL")
        throw new Error("Embedded wallet pay supports SOL only for now");
      if (!connected) throw new Error("Connect your wallet first");
      if (!provider || typeof (provider as any).request !== "function")
        throw new Error("Embedded wallet provider not ready");

      setPaying(true);
      const conn = await createConnection();
      const sig = await payWithConnectedWalletSDK({
        conn,
        signer: provider as any,
        payer: accounts![0],
        recipient: ev.receiverWallet,
        amount: amountSol,
        reference, // attach reference readonly key
      });
      setTxSig(sig);
    } catch (e: any) {
      alert(e?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!ev) return <div className="p-6">Event not found.</div>;

  const priceDisplay =
    ev.currency === "SOL"
      ? `${(ev.priceLamports / 1e9).toFixed(4)} SOL`
      : `${(ev.priceLamports / 1e6).toFixed(2)} USDC`;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {isNonMainnet && (
        <div className="mb-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded">
          You’re on <b>{CLUSTER}</b>. Make sure your wallet is also on <b>{CLUSTER}</b>.
        </div>
      )}

      <h1 className="text-2xl font-semibold text-gray-900 mb-1">{ev.title}</h1>
      <div className="text-sm text-gray-600 mb-6">
        {new Date(ev.startsAt).toLocaleString()} • {ev.venue || "TBA"}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Pay */}
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Pay by QR</h2>

          <div className="flex items-start gap-4">
            {payUrl ? (
              <PaymentQR url={isNonMainnet ? payUrl.compat : payUrl.strict} />
            ) : (
              <div className="w-[248px] h-[248px] rounded-xl bg-gray-100 animate-pulse" />
            )}

            <div className="flex-1 text-sm">
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-24 border rounded px-2 py-1"
                />
              </div>

              <div className="mb-2">Price per ticket: <b>{priceDisplay}</b></div>
              <div className="mb-2">
                Total:{" "}
                <b>
                  {ev.currency === "SOL"
                    ? `${(ev.priceLamports / 1e9 * qty).toFixed(4)} SOL`
                    : `${(ev.priceLamports / 1e6 * qty).toFixed(2)} USDC`}
                </b>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {payUrl ? (
                  <>
                    <a
                      href={isNonMainnet ? payUrl.compat : payUrl.strict}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Open in wallet
                    </a>
                    <button
                      className="text-xs px-2 py-1 border rounded"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          isNonMainnet ? payUrl.compat : payUrl.strict
                        )
                      }
                    >
                      Copy URL
                    </button>
                    <a
                      href={isNonMainnet ? payUrl.strict : payUrl.compat}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {isNonMainnet ? "Open (strict)" : "Open (compat)"}
                    </a>
                  </>
                ) : (
                  <span className="text-gray-500">Preparing URL…</span>
                )}
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Ref: <span className="font-mono break-all">{reference}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Connected Wallet Pay */}
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Pay with connected wallet</h2>

          <div className="text-sm mb-4">
            Uses your Web3Auth embedded wallet to sign and send a transfer with the
            same reference key.
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-24 border rounded px-2 py-1"
            />
          </div>

          <div className="mb-2">
            Total:{" "}
            <b>
              {ev.currency === "SOL"
                ? `${(ev.priceLamports / 1e9 * qty).toFixed(4)} SOL`
                : `${(ev.priceLamports / 1e6 * qty).toFixed(2)} USDC`}
            </b>
          </div>

          <button
            disabled={!connected || paying || ev.currency !== "SOL"}
            onClick={payWithConnectedWallet}
            className={`px-4 py-2 rounded ${
              !connected || ev.currency !== "SOL"
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            title={
              ev.currency !== "SOL"
                ? "Embedded pay supports SOL only for now"
                : !connected
                ? "Connect wallet first"
                : "Pay now"
            }
          >
            {paying ? "Paying…" : "Pay now"}
          </button>

          {txSig && (
            <div className="mt-3 text-sm">
              ✅ Paid! Tx:{" "}
              <a
                className="text-blue-600 underline"
                href={
                  CLUSTER === "mainnet-beta"
                    ? `https://explorer.solana.com/tx/${txSig}`
                    : `https://explorer.solana.com/tx/${txSig}?cluster=${CLUSTER}`
                }
                target="_blank"
                rel="noreferrer"
              >
                {txSig}
              </a>
            </div>
          )}

          {ev.currency !== "SOL" && (
            <div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded">
              Embedded wallet supports SOL transfers in this MVP. Use the QR option above for USDC.
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500">
            Reference: <span className="font-mono break-all">{reference}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
