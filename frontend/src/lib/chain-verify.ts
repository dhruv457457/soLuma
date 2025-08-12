import { Connection, PublicKey } from "@solana/web3.js";
import { RPC } from "../config/solana";

export async function findTxByReference(reference: string): Promise<string | null> {
  const conn = new Connection(RPC, "confirmed");
  const sigs = await conn.getSignaturesForAddress(new PublicKey(reference), { limit: 25 });
  return sigs.length ? sigs[0].signature : null; // newest first
}

export async function verifyTransferBySig({
  signature,
  destination,
  expectLamports,
}: {
  signature: string;
  destination: string;
  expectLamports: number;
}): Promise<boolean> {
  const conn = new Connection(RPC, "confirmed");
  const tx = await conn.getTransaction(signature, { maxSupportedTransactionVersion: 0 });
  if (!tx || !tx.meta) return false;

  const keys = tx.transaction.message.getAccountKeys().staticAccountKeys.map(k => k.toBase58());
  const idx = keys.indexOf(destination);
  if (idx < 0) return false;

  const pre = tx.meta.preBalances?.[idx] ?? 0;
  const post = tx.meta.postBalances?.[idx] ?? 0;
  const delta = post - pre;
  return delta === expectLamports;
}
