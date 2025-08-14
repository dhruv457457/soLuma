// src/config/solana.ts
import { Connection } from "@solana/web3.js";

export const RPC ="https://api.devnet.solana.com";

export const CLUSTER =
  (import.meta.env.VITE_CLUSTER as "mainnet-beta" | "devnet" | "testnet") ||
  "devnet";

export async function createConnection() {
  const c = new Connection(RPC, "confirmed");
  await c.getLatestBlockhash(); // quick probe
  return c;
}
