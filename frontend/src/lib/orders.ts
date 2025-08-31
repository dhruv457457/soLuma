// src/lib/orders.ts
import { CLUSTER } from "../config/solana";
import type { OrderDoc } from "../types/ticketing";

/**
 * Calls the backend API to create a new order and returns the orderId.
 */
export async function createOrder(payload: Omit<OrderDoc, 'id' | 'status' | 'createdAt' | 'txSig'>) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  const response = await fetch(`${baseUrl}/api/orders.create`, {
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
  splToken, // <-- NEW: Add splToken here
}: {
  orderId: string;
  txSig: string;
  reference: string;
  buyerWallet: string;
  splToken?: string; // <-- NEW: Add splToken here
}): Promise<string[]> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  const response = await fetch(`${baseUrl}/api/orders.verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId,
      txSig,
      reference,
      buyerWallet,
      cluster: CLUSTER,
      splToken, // <-- NEW: Pass splToken to the backend
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to verify payment and issue tickets.");
  }

  const { ticketIds } = await response.json();
  return ticketIds;
}