// src/lib/events.ts
import { db } from "../config/firebase";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import type { EventDoc } from "../types/ticketing";

// USDC Token Mint Address for Solana Devnet
const USDC_MINT_ADDRESS = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";

export async function createEvent(payload: any): Promise<string> {
  // Add the SPL token address if the currency is USDC
  if (payload.currency === "USDC") {
    payload.splToken = USDC_MINT_ADDRESS;
  }
  const ref = await addDoc(collection(db, "events"), payload);
  return ref.id;
}

export async function getEvent(eventId: string): Promise<EventDoc | null> {
  const snap = await getDoc(doc(db, "events", eventId));
  return snap.exists() ? { id: snap.id, ...snap.data() } as EventDoc : null;
}

export async function listPublishedEvents(): Promise<EventDoc[]> {
  const q = query(collection(db, "events"), where("status", "==", "published"), orderBy("startsAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as EventDoc[];
}