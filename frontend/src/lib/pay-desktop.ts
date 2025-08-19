import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferCheckedInstruction, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import bs58 from "bs58";
import BigNumber from "bignumber.js";
import { makePayURL } from "./solanapay";
import { parseURL, createTransfer } from "@solana/pay";


// --- Type Definitions and Helpers ---
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

export function embeddedSignerFromWeb3Auth(walletHook: any) {
  if (!walletHook) return null;
  if (typeof walletHook.signAndSendTransaction === "function" || typeof walletHook.signTransaction === "function") {
    return {
      signAndSendTransaction: walletHook.signAndSendTransaction?.bind(walletHook),
      signTransaction: walletHook.signTransaction?.bind(walletHook),
    };
  }
  if (walletHook.provider && typeof walletHook.provider.request === "function") {
    return walletHook.provider;
  }
  if (typeof walletHook.request === "function") {
    return walletHook;
  }
  return null;
}

function isLikelySignatureString(s: string) {
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
  try {
    const bytes = bs58.decode(s);
    if (bytes.length > 64) return bytes;
  } catch {}
  try {
    const bytes = Buffer.from(s, "base64");
    if (bytes.length > 64) return bytes;
  } catch {}
  return null;
}

async function requestWithVariations(s: any, method: string, tx: Transaction): Promise<any> {
  const serialized = tx.serialize({ requireAllSignatures: false, verifySignatures: false });
  const msgB58 = bs58.encode(serialized);
  const msgB64 = Buffer.from(serialized).toString("base64");

  try {
    return await s.request({ method, params: { message: msgB58 } });
  } catch (e1: any) {
    const m1 = String(e1?.message || e1 || "").toLowerCase();
    try {
      return await s.request({ method, params: { message: msgB64 } });
    } catch (e2: any) {
      const m2 = String(e2?.message || e2 || "").toLowerCase();
      try {
        return await s.request({ method, params: { serializedMessage: msgB58 } });
      } catch (e3: any) {
        const m3 = String(e3?.message || e3 || "").toLowerCase();
        try {
          return await s.request({ method, params: { serializedMessage: msgB64 } });
        } catch (e4) {
          throw new Error(`[${method}] failed: ${m1 || m2 || m3 || String(e4)}`);
        }
      }
    }
  }
}

function normalizeSigner(signer: AnySigner) {
  if (!signer) throw new Error("No Solana signer available");
  if (typeof (signer as any).signAndSendTransaction === "function") {
    const s: any = signer;
    return {
      signAndSendTransaction: async (tx: Transaction) => {
        const res = await s.signAndSendTransaction(tx);
        const signature = typeof res === "string" ? res : res?.signature;
        if (!signature) throw new Error("No signature from signAndSendTransaction");
        return { signature };
      },
      signTransaction: typeof s.signTransaction === "function" ? s.signTransaction.bind(s) : undefined,
    };
  }
  if (typeof (signer as any).request === "function") {
    const s: any = signer;
    async function trySignAndSend(tx: Transaction) {
      try {
        const res = await requestWithVariations(s, "solana_signAndSendTransaction", tx);
        const signature = typeof res === "string" ? res : res?.signature;
        if (!signature) throw new Error("No signature from solana_signAndSendTransaction");
        return { signature, alreadyBroadcasted: true };
      } catch (e: any) {
        const msg = String(e?.message || e || "").toLowerCase();
        if (msg.includes("method not found") || msg.includes("invalid method")) {
          try {
            const res = await requestWithVariations(s, "solana_sendTransaction", tx);
            const signature = typeof res === "string" ? res : res?.signature;
            if (!signature) throw new Error("No signature from solana_sendTransaction");
            return { signature, alreadyBroadcasted: true };
          } catch (e2) {
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
      let raw: string | undefined;

      if (typeof res === "string") {
        raw = res;
      } else if (res?.signedTransaction) {
        raw = res.signedTransaction;
      } else if (res?.result) {
        raw = res.result;
      } else if (res?.signature) {
        return { signatureFromWallet: raw, alreadyBroadcasted: true };
      }

      if (!raw) throw new Error("No signed transaction returned");

      if (isLikelySignatureString(raw)) {
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
      signTransaction: async (tx: Transaction) => {
        const { signedTx, signatureFromWallet, alreadyBroadcasted } =
          await signTransactionOnly(tx);

        if (alreadyBroadcasted && signatureFromWallet) {
          const fake = new Transaction();
          (fake as any).__alreadyBroadcastedSig = signatureFromWallet;
          return fake;
        }

        if (!signedTx) throw new Error("Wallet didn't return a signed tx");
        return signedTx;
      },
    };
  }
  if (typeof (signer as any).signTransaction === "function") {
    const s: any = signer;
    return { signTransaction: s.signTransaction.bind(s) };
  }

  throw new Error("Unsupported Solana signer");
}

/** Transfer SOL or SPL token with a Solana Pay reference using any connected signer */
export async function payWithConnectedWalletSDK({
  conn,
  signer: rawSigner,
  payer,
  recipient,
  amount,
  reference,
  splToken,
}: {
  conn: Connection;
  signer: AnySigner;
  payer: string;
  recipient: string;
  amount: number;
  reference: string;
  splToken?: string;
}) {
  if (!payer) throw new Error("Missing payer");
  if (!recipient) throw new Error("Missing recipient");
  if (!reference) throw new Error("Missing reference");
  
  const signer = normalizeSigner(rawSigner);
  
  // Create the transfer transaction using createTransfer with the fields directly
  const tx = await createTransfer(conn, new PublicKey(payer), {
    recipient: new PublicKey(recipient),
    amount: new BigNumber(amount),
    reference: reference ? [new PublicKey(reference)] : undefined,
    splToken: splToken ? new PublicKey(splToken) : undefined,
  });

  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
  
  // Try sign+send if available
  if (signer.signAndSendTransaction) {
    try {
      const res = await signer.signAndSendTransaction(tx);
      const signature = typeof res === "string" ? res : (res as any)?.signature;
      if (!signature) throw new Error("No signature from signAndSend");
      await conn.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
      return signature;
    } catch (e) {
      throw e;
    }
  }

  if (!signer.signTransaction) throw new Error("Wallet cannot signTransaction");
  const signed = await signer.signTransaction(tx);

  const injectedSig = (signed as any).__alreadyBroadcastedSig as string | undefined;
  if (injectedSig) {
    await conn.confirmTransaction({ signature: injectedSig, blockhash, lastValidBlockHeight });
    return injectedSig;
  }

  const sig = await conn.sendRawTransaction(signed.serialize());
  await conn.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });
  return sig;
}
