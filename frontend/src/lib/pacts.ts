import {
    collection,
    addDoc,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
    serverTimestamp,
    setDoc,
  } from "firebase/firestore";
  import { getDocs, where, query, orderBy } from "firebase/firestore";
  import { db } from "../config/firebase";
  import { buildSolanaPayURL } from "./solanapay";
  import { Keypair } from "@solana/web3.js";
  
  interface Participant {
    email?: string;
    wallet?: string;
    reference?: string; // base58 PublicKey string
    paid?: boolean;
    paidTx?: string;
    paidAt?: number;
  }
  
  interface Pact {
    name: string;
    amountPerPerson: number;   // display units (e.g., 0.5 SOL or 50 USDC)
    receiverWallet: string;    // receiver public key
    dueDate: string;           // ISO
    createdBy?: string;
    participants: Participant[];
  }
  
  /**
   * Create a new pact document in Firestore
   * Also writes quick-lookup docs pay_refs/{reference} -> { pactId, index }
   * so the webhook can resolve a participant fast.
   */
  export async function createPact(pact: Pact): Promise<string> {
    const participantsWithRefs = pact.participants.map((p) => ({
      ...p,
      // reference must be a valid Pubkey for wallets/Helius to include it in account keys
      reference: Keypair.generate().publicKey.toBase58(),
      paid: false,
    }));

    // NEW: flat array for querying by wallet later
    const participantWallets = participantsWithRefs
      .map((p) => p.wallet?.trim())
      .filter(Boolean) as string[];

    const pactRef = await addDoc(collection(db, "pacts"), {
      ...pact,
      participants: participantsWithRefs,
      participantWallets,
      createdAt: serverTimestamp(),
    });
  
    const pactId = pactRef.id;
  
    // index references for webhook
    for (let i = 0; i < participantsWithRefs.length; i++) {
      const refId = participantsWithRefs[i].reference!;
      await setDoc(doc(db, "pay_refs", refId), { pactId, index: i });
    }
  
    return pactId;
  }
  
  /**
   * Listen to a pact document in real-time
   */
  export function listenPact(
    pactId: string,
    callback: (data: any) => void
  ): () => void {
    const docRef = doc(db, "pacts", pactId);
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) callback({ id: snap.id, ...snap.data() });
    });
  }
  
  /**
   * Get a pact once
   */
  export async function getPact(pactId: string): Promise<any> {
    const docRef = doc(db, "pacts", pactId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  }
  
  /**
   * Update participant payment status
   */
  export async function markParticipantPaid(
    pactId: string,
    participantIndex: number,
    txSig?: string
  ) {
    const pact = await getPact(pactId);
    if (!pact) return;
  
    pact.participants[participantIndex].paid = true;
    if (txSig) {
      pact.participants[participantIndex].paidTx = txSig;
      pact.participants[participantIndex].paidAt = Date.now();
    }
  
    const docRef = doc(db, "pacts", pactId);
    await updateDoc(docRef, { participants: pact.participants });
  }
  
  /**
   * Generate Solana Pay URLs for each participant
   */
  export function generatePaymentLinks(
    pact: any
  ): { label: string; url: string }[] {
    return (pact.participants || []).map((p: Participant, idx: number) => {
      const url = buildSolanaPayURL({
        receiver: pact.receiverWallet,      // <-- fix: use `receiver`
        amount: pact.amountPerPerson,
        reference: p.reference!,            // base58 pubkey
        label: pact.name,
        message: `Pact payment for ${p.email || p.wallet || `P${idx + 1}`}`,
      });
  
      return {
        label: p.email || p.wallet || `Participant ${idx + 1}`,
        url,
      };
    });
  }
  export async function listPactsByCreator(creatorWallet: string) {
    const col = collection(db, "pacts");
    const q = query(col, where("createdBy", "==", creatorWallet), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
  }
  
  // Build a deep link page for a single participant
  export function buildParticipantPageLink(pactId: string, index: number) {
    return `/pay/${pactId}/${index}`;
  }

  export async function listPactsForWallet(wallet: string) {
    const col = collection(db, "pacts");
    const q = query(
      col,
      where("participantWallets", "array-contains", wallet),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
  }

  // Utility to find this wallet's participant index inside a pact
  export function findParticipantIndexByWallet(pact: any, wallet: string): number {
    return (pact.participants || []).findIndex((p: any) => (p.wallet || "").trim() === wallet.trim());
  }