import { collection, query, where, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import type { EventDoc, OrderDoc } from "../types/ticketing";

// Helper function to convert lamports to a more readable format
const convertLamportsToDisplay = (lamports: number, currency: string) => {
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
export async function getOrganizerEvents(createdBy: string): Promise<EventDoc[]> {
  const q = query(collection(db, "events"), where("createdBy", "==", createdBy));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as EventDoc[];
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
    const order = doc.data() as OrderDoc;
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
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as OrderDoc[];
    onUpdate(orders);
  });

  return unsubscribe;
}