import { db } from "../config/firebase";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";

export async function createEvent(payload: any): Promise<string> {
  const ref = await addDoc(collection(db, "events"), payload);
  return ref.id;
}

export async function getEvent(eventId: string) {
  const snap = await getDoc(doc(db, "events", eventId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function listPublishedEvents() {
  const q = query(collection(db, "events"), where("status", "==", "published"), orderBy("startsAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
}
