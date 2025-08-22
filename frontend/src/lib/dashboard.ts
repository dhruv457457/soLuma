// src/lib/dashboard.ts
import { collection, query, where, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import type { EventDoc, OrderDoc } from "../types/ticketing";

// Helper function to convert lamports to a more readable format
const convertLamportsToDisplay = (lamports: number, currency: 'SOL' | 'USDC' | string): string => {
  if (currency === "SOL") {
    return (lamports / 1e9).toFixed(4);
  }
  if (currency === "USDC") {
    return (lamports / 1e6).toFixed(2);
  }
  return lamports.toString();
};

/**
 * Fetches events created by a specific user.
 */
export async function getOrganizerEvents(createdBy: string) {
  const q = query(collection(db, "events"), where("createdBy", "==", createdBy));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Calculates dashboard statistics (one-time fetch).
 */
export async function getDashboardStats(events: EventDoc[]) {
  if (events.length === 0) {
    return {
      totalRevenue: { SOL: 0, USDC: 0 },
      totalTicketsSold: 0,
      activeEvents: 0,
    };
  }

  const eventIds = events.map(e => e.id);
  const ordersRef = collection(db, "orders");

  const q = query(ordersRef, where("eventId", "in", eventIds), where("status", "==", "paid"));
  const ordersSnap = await getDocs(q);

  let totalTicketsSold = 0;
  let totalRevenueSOL = 0;
  let totalRevenueUSDC = 0;

  ordersSnap.docs.forEach(doc => {
    const order = doc.data();
    totalTicketsSold += order.qty;
    if (order.currency === "SOL") {
      totalRevenueSOL += order.amountLamports;
    } else if (order.currency === "USDC") {
      totalRevenueUSDC += order.amountLamports;
    }
  });

  return {
    totalRevenue: { SOL: totalRevenueSOL, USDC: totalRevenueUSDC },
    totalTicketsSold,
    activeEvents: events.filter(e => e.status === "published").length,
  };
}

/**
 * Subscribes to real-time updates for recent paid orders.
 */
export function subscribeToRecentActivity(eventIds: string[], onUpdate: (orders: OrderDoc[]) => void) {
  if (eventIds.length === 0) return () => {};

  const q = query(
    collection(db, "orders"),
    where("eventId", "in", eventIds),
    where("status", "==", "paid"),
    orderBy("createdAt", "desc"),
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    onUpdate(orders as OrderDoc[]);
  });

  return unsubscribe;
}

/**
 * Subscribes to real-time updates for all orders (attendees) for a list of event IDs.
 * Returns an unsubscribe function to clean up the listener.
 */
export function subscribeToOrganizerAttendees(eventIds: string[], onUpdate: (orders: OrderDoc[]) => void) {
  if (eventIds.length === 0) {
    onUpdate([]);
    return () => {}; // Return a no-op unsubscribe function
  }

  const q = query(
    collection(db, "orders"),
    where("eventId", "in", eventIds),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const attendees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    onUpdate(attendees as OrderDoc[]);
  });

  return unsubscribe;
}

/**
 * Fetches all orders (attendees) for a list of event IDs.
 * (This function is now redundant for the dashboard and can be used for one-time fetches if needed elsewhere).
 */
export async function getOrganizerAttendees(eventIds: string[]) {
  if (eventIds.length === 0) {
    return [];
  }

  const q = query(
    collection(db, "orders"),
    where("eventId", "in", eventIds),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}