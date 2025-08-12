// src/lib/pay-desktop.ts
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import bs58 from "bs58";

type AnySigner =
  | {
      signAndSendTransaction: (
        tx: Transaction
      ) => Promise<{ signature: string } | string>;
      signTransaction?: (tx: Transaction) => Promise<Transaction>;
    }
  | {
      request: (args: any) => Promise<any>;
      signTransaction?: (tx: Transaction) => Promise<Transaction>;
    }
  | any;

/** Build a signer from the Web3Auth Solana hook (handles common shapes). */
export function embeddedSignerFromWeb3Auth(walletHook: any) {
  if (!walletHook) return null;

  // 1) Hook exposes signing methods directly
  if (
    typeof walletHook.signAndSendTransaction === "function" ||
    typeof walletHook.signTransaction === "function"
  ) {
    return {
      signAndSendTransaction: walletHook.signAndSendTransaction?.bind(walletHook),
      signTransaction: walletHook.signTransaction?.bind(walletHook),
    };
  }

  // 2) Most builds: RPC bridge is on `provider.request`
  if (walletHook.provider && typeof walletHook.provider.request === "function") {
    return walletHook.provider; // normalizeSigner handles .request(...)
  }

  // 3) Some builds put the RPC bridge right on the hook
  if (typeof walletHook.request === "function") {
    return walletHook; // treat hook as provider
  }

  return null;
}

function isLikelySignatureString(s: string) {
  // Base58 signatures are ~88 chars; base64 ~96 chars. We can't be perfect,
  // but if it's short-ish and decodes to 64 bytes, it's probably a signature.
  try {
    const b58 = bs58.decode(s);
    return b58.length === 64;
  } catch {}
  try {
    const b64 = Buffer.from(s, "base64");
    return b64.length === 64;
  } catch {}
  return false;
}

function decodeSignedTxUnknownEncoding(s: string): Uint8Array | null {
  // Try base58 first
  try {
    const bytes = bs58.decode(s);
    if (bytes.length > 64) return bytes; // Tx should be >64 bytes
  } catch {}
  // Try base64
  try {
    const bytes = Buffer.from(s, "base64");
    if (bytes.length > 64) return bytes;
  } catch {}
  return null;
}

async function requestWithVariations(
  s: any,
  method: string,
  tx: Transaction
): Promise<any> {
  // Some bridges expect base58 of the *serialized tx*
  const serialized = tx.serialize({ requireAllSignatures: false, verifySignatures: false });
  const msgB58 = bs58.encode(serialized);
  const msgB64 = Buffer.from(serialized).toString("base64");

  // 1) message (base58)
  try {
    return await s.request({ method, params: { message: msgB58 } });
  } catch (e1: any) {
    const m1 = String(e1?.message || e1 || "").toLowerCase();

    // 2) message (base64)
    try {
      return await s.request({ method, params: { message: msgB64 } });
    } catch (e2: any) {
      const m2 = String(e2?.message || e2 || "").toLowerCase();

      // 3) serializedMessage (base58)
      try {
        return await s.request({ method, params: { serializedMessage: msgB58 } });
      } catch (e3: any) {
        const m3 = String(e3?.message || e3 || "").toLowerCase();

        // 4) serializedMessage (base64)
        try {
          return await s.request({ method, params: { serializedMessage: msgB64 } });
        } catch (e4) {
          // Propagate the first error to keep context
          throw new Error(
            `[${method}] failed: ${m1 || m2 || m3 || String(e4)}`
          );
        }
      }
    }
  }
}

function normalizeSigner(signer: AnySigner) {
  if (!signer) throw new Error("No Solana signer available");

  // A) Objects with signAndSendTransaction (Phantom or hook-bound funcs)
  if (typeof (signer as any).signAndSendTransaction === "function") {
    const s: any = signer;
    return {
      signAndSendTransaction: async (tx: Transaction) => {
        const res = await s.signAndSendTransaction(tx);
        const signature = typeof res === "string" ? res : res?.signature;
        if (!signature) throw new Error("No signature from signAndSendTransaction");
        return { signature };
      },
      signTransaction:
        typeof s.signTransaction === "function" ? s.signTransaction.bind(s) : undefined,
    };
  }

  // B) RPC bridge (.request) — robust multi-method fallback
  if (typeof (signer as any).request === "function") {
    const s: any = signer;

    async function trySignAndSend(tx: Transaction) {
      // 1) Preferred: solana_signAndSendTransaction
      try {
        const res = await requestWithVariations(s, "solana_signAndSendTransaction", tx);
        const signature = typeof res === "string" ? res : res?.signature;
        if (!signature) throw new Error("No signature from solana_signAndSendTransaction");
        return { signature, alreadyBroadcasted: true };
      } catch (e: any) {
        const msg = String(e?.message || e || "").toLowerCase();

        // 2) Fallback: solana_sendTransaction
        if (msg.includes("method not found") || msg.includes("invalid method")) {
          try {
            const res = await requestWithVariations(s, "solana_sendTransaction", tx);
            const signature = typeof res === "string" ? res : res?.signature;
            if (!signature) throw new Error("No signature from solana_sendTransaction");
            return { signature, alreadyBroadcasted: true };
          } catch (e2) {
            // Fall through to signTransaction-only path below
            throw e2;
          }
        }
        throw e;
      }
    }

    async function signTransactionOnly(tx: Transaction): Promise<{
      signedTx?: Transaction;
      signatureFromWallet?: string;
      alreadyBroadcasted?: boolean;
    }> {
      const res = await requestWithVariations(s, "solana_signTransaction", tx);

      // Common shapes:
      //  - string (signed tx base58/base64) OR signature only
      //  - { signedTransaction: string }  (base58/base64)
      //  - { result: string }             (base58/base64)
      //  - { signature: string }          (wallet may have already sent it)
      let raw: string | undefined;

      if (typeof res === "string") {
        raw = res;
      } else if (res?.signedTransaction) {
        raw = res.signedTransaction;
      } else if (res?.result) {
        raw = res.result;
      } else if (res?.signature) {
        // Some bridges return only a signature (already sent)
        return { signatureFromWallet: res.signature, alreadyBroadcasted: true };
      }

      if (!raw) throw new Error("No signed transaction returned");

      if (isLikelySignatureString(raw)) {
        // It's a signature, treat as already broadcasted
        return { signatureFromWallet: raw, alreadyBroadcasted: true };
      }

      const bytes = decodeSignedTxUnknownEncoding(raw);
      if (!bytes) throw new Error("Unable to decode signed transaction (not b58/b64)");

      try {
        const signedTx = Transaction.from(bytes);
        return { signedTx };
      } catch (e) {
        throw new Error("Failed to parse signed tx bytes");
      }
    }

    return {
      signAndSendTransaction: trySignAndSend,
      // We'll return a wrapper that yields a Transaction when possible
      signTransaction: async (tx: Transaction) => {
        const { signedTx, signatureFromWallet, alreadyBroadcasted } =
          await signTransactionOnly(tx);

        // If wallet already broadcasted, emulate the typical return shape
        if (alreadyBroadcasted && signatureFromWallet) {
          // Return a dummy tx so caller can decide not to re-send;
          // We'll handle this in payWithConnectedWalletSDK below.
          const fake = new Transaction();
          (fake as any).__alreadyBroadcastedSig = signatureFromWallet;
          return fake;
        }

        if (!signedTx) throw new Error("Wallet didn't return a signed tx");
        return signedTx;
      },
    };
  }

  // C) Legacy Phantom (signTransaction only)
  if (typeof (signer as any).signTransaction === "function") {
    const s: any = signer;
    return { signTransaction: s.signTransaction.bind(s) };
  }

  throw new Error("Unsupported Solana signer");
}

/** Transfer SOL with a Solana Pay reference using any connected signer */
export async function payWithConnectedWalletSDK({
  conn,
  signer: rawSigner,
  payer,
  recipient,
  amount,
  reference,
}: {
  conn: Connection;
  signer: AnySigner; // Web3Auth hook/provider or window.solana style
  payer: string;
  recipient: string;
  amount: number; // SOL
  reference: string; // base58
}) {
  if (!payer) throw new Error("Missing payer");
  if (!recipient) throw new Error("Missing recipient");
  if (!reference) throw new Error("Missing reference");

  const from = new PublicKey(payer);
  const to = new PublicKey(recipient);
  const refPk = new PublicKey(reference);

  const ix = SystemProgram.transfer({
    fromPubkey: from,
    toPubkey: to,
    lamports: Math.round(amount * 1e9),
  });

  // Attach the Solana Pay reference (readonly, non-signer)
  ix.keys.push({ pubkey: refPk, isSigner: false, isWritable: false });

  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
  const tx = new Transaction({ feePayer: from, recentBlockhash: blockhash }).add(ix);

  const signer = normalizeSigner(rawSigner);

  // Try sign+send if available
  if (signer.signAndSendTransaction) {
    try {
      const res = await signer.signAndSendTransaction(tx);
      const signature =
        typeof res === "string" ? res : (res as any)?.signature;
      if (!signature) throw new Error("No signature from signAndSend");
      await conn.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
      return signature;
    } catch {
      // Fall through to sign+submit path
    }
  }

  // Sign only, then submit ourselves (or detect already-broadcasted)
  if (!signer.signTransaction) throw new Error("Wallet cannot signTransaction");
  const signed = await signer.signTransaction(tx);

  // If our wrapper marked it as already broadcasted, just confirm & return
  const injectedSig = (signed as any).__alreadyBroadcastedSig as string | undefined;
  if (injectedSig) {
    await conn.confirmTransaction({ signature: injectedSig, blockhash, lastValidBlockHeight });
    return injectedSig;
  }

  const sig = await conn.sendRawTransaction(signed.serialize());
  await conn.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });
  return sig;
}
