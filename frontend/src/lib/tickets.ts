// src/lib/tickets.ts
import { getEvent } from "../lib/events";
import type { TicketDoc } from "../types/ticketing";

/**
 * Calls the backend API to fetch all tickets for a given wallet address.
 */
export async function getMyTickets(ownerWallet: string): Promise<TicketDoc[]> {
  if (!ownerWallet) {
    throw new Error("Wallet address is required to fetch tickets.");
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/tickets.list`, {
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
export async function getTicket(ticketId: string): Promise<TicketDoc> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/tickets.get`, {
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
export async function redeemTicket(ticketId: string, nonce: string): Promise<{ success: boolean; message?: string }> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/tickets.redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId, nonce }),
    });
  
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || "Failed to redeem ticket.");
    }
  
    return result;
  }