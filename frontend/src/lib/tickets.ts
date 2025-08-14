// src/lib/tickets.ts
import { getEvent } from "../lib/events";

/**
 * Calls the backend API to fetch all tickets for a given wallet address.
 */
export async function getMyTickets(ownerWallet) {
  if (!ownerWallet) {
    throw new Error("Wallet address is required to fetch tickets.");
  }

  const response = await fetch("http://localhost:3001/api/tickets.list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerWallet }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch tickets.");
  }

  const result = await response.json();
  return result.tickets;
}

/**
 * Calls the backend API to fetch a single ticket.
 */
export async function getTicket(ticketId) {
  const response = await fetch("http://localhost:3001/api/tickets.get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticketId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch ticket.");
  }

  const result = await response.json();
  return result.ticket;
}

/**
 * Calls the backend API to redeem a ticket.
 */
export async function redeemTicket(ticketId, nonce) {
  const response = await fetch("http://localhost:3001/api/tickets.redeem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticketId, nonce }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to redeem ticket.");
  }

  const result = await response.json();
  return result;
}