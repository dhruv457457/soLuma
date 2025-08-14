// src/lib/orders.ts
import { CLUSTER } from "../config/solana";

/**
 * Calls the backend API to create a new order and returns the orderId.
 */
export async function createOrder(payload) {
  const response = await fetch("http://localhost:3001/api/orders.create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create order.");
  }

  const { orderId } = await response.json();
  return orderId;
}

/**
 * Calls the backend API to verify a payment and issue tickets.
 */
export async function verifyOrderAndGetTickets({
  orderId,
  txSig,
  reference,
  buyerWallet,
}: {
  orderId: string;
  txSig: string;
  reference: string;
  buyerWallet: string;
}): Promise<string[]> {
  const response = await fetch("http://localhost:3001/api/orders.verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId,
      txSig,
      reference,
      buyerWallet,
      cluster: CLUSTER,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to verify payment and issue tickets.");
  }

  const { ticketIds } = await response.json();
  return ticketIds;
}