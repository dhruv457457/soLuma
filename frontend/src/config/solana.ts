// src/config/solana.ts
import { Connection } from "@solana/web3.js";

const RPC = "https://api.devnet.solana.com";

export async function createConnection() {
  const c = new Connection(RPC, "confirmed");
  await c.getLatestBlockhash(); // quick probe
  return c;
}
