import bs58 from "bs58";
import { Transaction } from "@solana/web3.js";

/**
 * Normalizes a signer:
 * - Phantom: window.solana.{signAndSendTransaction|signTransaction}
 * - Web3Auth Solana provider: provider.request({ method: "solana_signAndSendTransaction", ... })
 */
export function makeSigner(provider: any) {
  // Phantom (or any wallet adapter on window)
  if (provider?.isPhantom || provider?.signAndSendTransaction || provider?.signTransaction) {
    return provider;
  }

  // Web3Auth Solana provider via RPC
  if (provider?.request) {
    return {
      signAndSendTransaction: async (tx: Transaction) => {
        const serialized = tx.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        });
        const message = bs58.encode(serialized);
        const res = await provider.request({
          method: "solana_signAndSendTransaction",
          params: { message },
        });
        // Web3Auth sometimes returns { signature } or the raw string
        const signature = typeof res === "string" ? res : res?.signature;
        return { signature };
      },
      // optional: implement signTransaction if you ever need a 2-step flow
    };
  }

  throw new Error("No compatible signer found");
}
