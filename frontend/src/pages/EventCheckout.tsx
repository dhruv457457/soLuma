// src/pages/EventCheckout.tsx

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Keypair } from "@solana/web3.js";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useWeb3Auth } from "@web3auth/modal/react";
import { FaQrcode, FaWallet, FaPlus, FaMinus, FaExclamationTriangle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

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
    setTxSig(null);
    setErr(null);
  }, [qty]);

  // Create a new order whenever the reference changes
  useEffect(() => {
    if (!eventId || !accounts?.[0] || !reference) return;

    const createNewOrder = async () => {
      try {
        setLoading(true);
        const eventDoc = ev || await getEvent(eventId);
        if (!eventDoc) throw new Error("Event not found.");
        if (!ev) setEv(eventDoc as EventDoc);

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
    };
    
    createNewOrder();
  }, [eventId, accounts, reference]);

  const payUrl = useMemo<null | { strict: string; compat: string; total: number }>(() => {
    if (!ev) return null;
    const per = ev.currency === "SOL" ? ev.priceLamports / 1e9 : ev.priceLamports / 1e6;
    const total = per * qty;

    const urlParams = {
      recipient: ev.receiverWallet,
      amount: total,
      reference,
      splToken: ev.splToken,
      label: ev.title,
      message: `Ticket purchase x${qty}`,
      cluster: CLUSTER as any,
    };

    return {
      strict: makePayURL(urlParams).toString(),
      compat: makeCompatURL(urlParams).toString(),
      total,
    };
  }, [ev, qty, reference]);

  async function payWithConnectedWallet() {
    try {
      if (!ev) throw new Error("Event not loaded");
      if (!connected) throw new Error("Connect your wallet first");
      if (!provider || typeof (provider as any).request !== "function") throw new Error("Wallet provider not ready");
      if (!orderId) throw new Error("Order not created. Please wait or refresh.");

      setPaying(true);
      setErr(null);
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

      const verifyOrderPayload = {
        orderId,
        txSig: sig,
        reference,
        buyerWallet: accounts![0],
        ...(ev.splToken ? { splToken: ev.splToken } : {}),
      };
      
      const ticketIds = await verifyOrderAndGetTickets(verifyOrderPayload);

      if (!ticketIds || ticketIds.length === 0) {
        throw new Error("Failed to issue tickets after payment was confirmed.");
      }
      navigate(`/tickets/${ticketIds[0]}`);
    } catch (e: any) {
      setErr(e?.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  if (loading && !ev)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading Checkout...</p>
        </div>
      </div>
    );
  if (!ev)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-400 p-6">
        Error: {err || "Event not found."}
      </div>
    );

  const pricePerUnit = ev.currency === "SOL" ? ev.priceLamports / 1e9 : ev.priceLamports / 1e6;
  const totalDisplay = ev.currency === "SOL" ? `${(pricePerUnit * qty).toFixed(4)} SOL` : `${(pricePerUnit * qty).toFixed(2)} USDC`;

  const handleQtyChange = (delta: number) => {
    setQty((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Order Summary */}
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                {ev.bannerUrl && <img src={ev.bannerUrl} alt={ev.title} className="w-full h-48 object-cover rounded-t-2xl" />}
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-white">{ev.title}</h2>
                    <p className="text-gray-400 mt-1">{new Date(ev.startsAt).toLocaleString()}</p>
                </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Ticket Quantity</span>
                        <div className="flex items-center gap-3 bg-black border border-gray-700 rounded-full p-1">
                            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8" onClick={() => handleQtyChange(-1)}><FaMinus /></Button>
                            <span className="text-xl font-bold w-12 text-center">{qty}</span>
                            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8" onClick={() => handleQtyChange(1)}><FaPlus /></Button>
                        </div>
                    </div>
                     <div className="flex items-center justify-between text-gray-400 text-sm">
                        <span>Price per ticket</span>
                        <span>{pricePerUnit} {ev.currency}</span>
                    </div>
                    <hr className="border-gray-700"/>
                    <div className="flex items-center justify-between text-2xl font-bold">
                        <span>Total</span>
                        <span className="text-purple-400">{totalDisplay}</span>
                    </div>
                </CardContent>
            </Card>
          </div>

          {/* Right Column: Payment Methods */}
          <div>
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Complete Your Purchase</CardTitle>
                    <p className="text-gray-400 text-sm pt-2">You can pay with your connected wallet or scan the QR code.</p>
                </CardHeader>
                <CardContent>
                    {isNonMainnet && (
                      <div className="mb-6 text-xs text-center text-amber-300 bg-amber-900/20 border border-amber-800/50 p-3 rounded-xl">
                        You’re on <b>{CLUSTER}</b>. Ensure your wallet is also on <b>{CLUSTER}</b>.
                      </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Option 1: Pay with Wallet */}
                        <div className="flex flex-col items-center p-6 bg-black rounded-2xl border border-gray-800/50 space-y-4">
                            <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2"><FaWallet /> Pay with Wallet</h3>
                            <p className="text-gray-400 text-sm text-center flex-grow">Pay directly with your currently connected wallet.</p>
                            <Button
                                disabled={!connected || paying || loading}
                                onClick={payWithConnectedWallet}
                                className="w-full py-3 font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all"
                            >
                                {loading ? "Preparing..." : paying ? "Processing..." : `Pay Now`}
                            </Button>
                        </div>
                        
                        {/* Option 2: Scan to Pay */}
                        <div className="flex flex-col items-center p-6 bg-black rounded-2xl border border-gray-800/50 space-y-4">
                            <h3 className="text-xl font-semibold text-cyan-400 flex items-center gap-2"><FaQrcode /> Scan to Pay</h3>
                             <div className="flex-grow flex items-center justify-center">
                                {payUrl ? <PaymentQR url={isNonMainnet ? payUrl.compat : payUrl.strict} /> : <div className="w-[144px] h-[144px] rounded-lg bg-gray-700 animate-pulse" />}
                             </div>
                            <a href={payUrl ? (isNonMainnet ? payUrl.compat : payUrl.strict) : '#'} target="_blank" rel="noreferrer" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
                                Open in Wallet
                            </a>
                        </div>
                    </div>

                    {err && (
                        <div className="mt-6 text-sm text-red-400 bg-red-900/30 border border-red-500/30 p-3 rounded-lg flex items-start gap-2">
                            <FaExclamationTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{err}</span>
                        </div>
                    )}
                    {txSig && (
                        <div className="mt-6 text-xs text-green-400 font-mono text-center break-all">
                            ✅ Payment Sent! Tx:{" "}
                            <a className="underline text-cyan-400" href={`https://explorer.solana.com/tx/${txSig}?cluster=${CLUSTER}`} target="_blank" rel="noreferrer">
                                {txSig.substring(0, 10)}...
                            </a>
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}