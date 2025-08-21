// src/pages/EventCheckout.tsx

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Keypair } from "@solana/web3.js";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useWeb3Auth } from "@web3auth/modal/react";
import { FaMoneyBillWave, FaQrcode, FaWallet } from "react-icons/fa";
import { FaPlus, FaMinus } from "react-icons/fa6";

import { ensureFirebaseAuth } from "../config/firebase";
import { getEvent } from "../lib/events";
import { createOrder, verifyOrderAndGetTickets } from "../lib/orders";
import { makePayURL, makeCompatURL } from "../lib/solanapay";
import { createConnection, CLUSTER } from "../config/solana";
import { payWithConnectedWalletSDK } from "../lib/pay-desktop";
import PaymentQR from "../components/PaymentQR";
import type { EventDoc } from "../types/ticketing";

export default function EventCheckout() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const { accounts } = useSolanaWallet();
  const { provider } = useWeb3Auth();
  const connected = !!accounts?.[0];

  const [ev, setEv] = useState<EventDoc | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [reference, setReference] = useState<string>(Keypair.generate().publicKey.toBase58());

  const isNonMainnet = CLUSTER !== "mainnet-beta";

  // Regenerate reference and invalidate orderId if qty changes
  useEffect(() => {
    setReference(Keypair.generate().publicKey.toBase58());
    setOrderId(null);
  }, [qty]);

  useEffect(() => {
    ensureFirebaseAuth();
    if (!eventId || !accounts?.[0] || !reference) return;

    (async () => {
      setLoading(true);
      try {
        const eventDoc = await getEvent(eventId);
        if (!eventDoc) throw new Error("Event not found.");
        setEv(eventDoc as EventDoc);

        const orderPayload = {
          eventId,
          buyerWallet: accounts[0],
          qty,
          amountLamports: eventDoc.priceLamports * qty,
          currency: eventDoc.currency,
          receiverWallet: eventDoc.receiverWallet,
          reference,
          ...(eventDoc.splToken ? { splToken: eventDoc.splToken } : {}),
        };

        const newOrderId = await createOrder(orderPayload);
        setOrderId(newOrderId);
        setErr(null);
      } catch (e: any) {
        setErr(e?.message || "Failed to initialize checkout.");
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId, accounts, reference, qty]);

  const payUrl = useMemo<null | { strict: string; compat: string; total: number }>(() => {
    if (!ev) return null;
    const per = ev.currency === "SOL" ? ev.priceLamports / 1e9 : ev.priceLamports / 1e6;
    const total = per * qty;

    const strict = makePayURL({
      recipient: ev.receiverWallet,
      amount: total,
      reference,
      splToken: ev.splToken,
      label: ev.title,
      message: `Ticket purchase x${qty}`,
      cluster: CLUSTER as any,
    }).toString();

    const compat = makeCompatURL({
      recipient: ev.receiverWallet,
      amount: total,
      splToken: ev.splToken,
      label: ev.title,
      message: `Ticket purchase x${qty}`,
      cluster: CLUSTER as any,
    }).toString();

    return { strict, compat, total };
  }, [ev, qty, reference]);

  async function payWithConnectedWallet() {
    try {
      if (!ev) throw new Error("Event not loaded");
      if (!connected) throw new Error("Connect your wallet first");
      if (!provider || typeof (provider as any).request !== "function")
        throw new Error("Embedded wallet provider not ready");
      if (!orderId) throw new Error("Order not created.");

      setPaying(true);
      const conn = await createConnection();
      const per = ev.currency === "SOL" ? ev.priceLamports / 1e9 : ev.priceLamports / 1e6;
      const totalAmount = per * qty;

      const sig = await payWithConnectedWalletSDK({
        conn,
        signer: provider as any,
        payer: accounts![0],
        recipient: ev.receiverWallet,
        amount: totalAmount,
        reference,
        splToken: ev.splToken,
      });
      setTxSig(sig);

      // --- CRITICAL CHANGE: Fix the payload for verifyOrderAndGetTickets ---
      const verifyOrderPayload = {
        orderId,
        txSig: sig,
        reference,
        buyerWallet: accounts[0],
        // Conditionally include splToken to avoid the 'undefined' error
        ...(ev.splToken ? { splToken: ev.splToken } : {}),
      };
      
      const ticketIds = await verifyOrderAndGetTickets(verifyOrderPayload);

      if (!ticketIds || ticketIds.length === 0) {
        alert("Failed to issue tickets after payment.");
        return;
      }
      navigate(`/tickets/${ticketIds[0]}`);
    } catch (e: any) {
      alert(e?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading Event Details...</p>
        </div>
      </div>
    );
  if (err)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400 p-6">
        Error: {err}
      </div>
    );
  if (!ev)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400 p-6">
        Event not found.
      </div>
    );

  const pricePerUnit =
    ev.currency === "SOL"
      ? ev.priceLamports / 1e9
      : ev.priceLamports / 1e6;
  const totalDisplay =
    ev.currency === "SOL"
      ? `${(pricePerUnit * qty).toFixed(4)} SOL`
      : `${(pricePerUnit * qty).toFixed(2)} USDC`;

  const handleQtyChange = (delta: number) => {
    setQty((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Checkout
          </h1>
          <p className="text-gray-400 text-lg">
            Finalize your purchase for{" "}
            <b className="text-white">{ev.title}</b>
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
          {isNonMainnet && (
            <div className="mb-6 text-xs text-amber-300 bg-amber-900/20 border border-amber-800/50 p-3 rounded-xl">
              You’re on <b>{CLUSTER}</b>. Ensure your wallet is also on{" "}
              <b>{CLUSTER}</b>.
            </div>
          )}

          {/* Event Info */}
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-semibold text-white mb-2">
              {ev.title}
            </h2>
            <p className="text-gray-400">
              {new Date(ev.startsAt).toLocaleString()} • {ev.venue || "TBA"}
            </p>
            <p className="text-xl text-purple-400 font-bold mt-4">
              Price per ticket: {pricePerUnit} {ev.currency}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* QR Pay Section */}
            <div className="flex flex-col items-center p-6 bg-black rounded-2xl border border-gray-800/50 flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <FaQrcode /> Scan to Pay
              </h3>
              {payUrl ? (
                <>
                  <PaymentQR url={isNonMainnet ? payUrl.compat : payUrl.strict} />
                  <a
                    href={isNonMainnet ? payUrl.compat : payUrl.strict}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 transition-colors py-2 px-6 rounded-full flex items-center gap-2"
                  >
                    Open in Wallet
                  </a>
                </>
              ) : (
                <div className="w-[180px] h-[180px] rounded-lg bg-gray-700 animate-pulse" />
              )}
            </div>

            {/* Wallet Pay Section */}
            <div className="flex flex-col items-center p-6 bg-black rounded-2xl border border-gray-800/50">
              <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <FaWallet /> Pay with Wallet
              </h3>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => handleQtyChange(-1)}
                  className="bg-gray-700 hover:bg-gray-600 transition-colors p-3 rounded-full text-white"
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value) || 1))
                  }
                  min={1}
                  className="w-20 text-center text-white bg-transparent border-b border-gray-600 text-3xl font-bold focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => handleQtyChange(1)}
                  className="bg-gray-700 hover:bg-gray-600 transition-colors p-3 rounded-full text-white"
                >
                  <FaPlus />
                </button>
              </div>

              <div className="text-xl text-white font-bold mb-4">
                Total: <span className="text-purple-400">{totalDisplay}</span>
              </div>

              <button
                disabled={!connected || paying}
                onClick={payWithConnectedWallet}
                className={`py-3 px-8 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  !connected || paying
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {paying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <FaMoneyBillWave /> Pay Now
                  </>
                )}
              </button>

              {/* Transaction Signature Display */}
              {txSig && (
                <div className="mt-4 text-xs text-green-400 font-mono text-center break-all">
                  ✅ Paid! Tx:{" "}
                  <a
                    className="underline text-cyan-400"
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
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-500 text-center">
              Reference: <span className="font-mono break-all">{reference}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }