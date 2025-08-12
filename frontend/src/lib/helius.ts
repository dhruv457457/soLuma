import { createConnection } from "../config/solana";
import { PublicKey } from "@solana/web3.js";

/**
 * Poll devnet for a tx that includes the Solana Pay `reference` pubkey.
 * Returns the latest signature if found, else null after timeout.
 */
export async function waitForReferenceTx(
  referenceBase58: string,
  { timeoutMs = 30_000, intervalMs = 1500 } = {}
): Promise<string | null> {
  const ref = new PublicKey(referenceBase58);
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const connection = await createConnection();
      const sigs = await connection.getSignaturesForAddress(ref, { limit: 1 });
      if (sigs.length > 0) return sigs[0].signature;
    } catch (_) {}
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return null;
}
