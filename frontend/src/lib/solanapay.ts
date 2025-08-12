import { encodeURL } from "@solana/pay";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";

type Cluster = "mainnet-beta" | "devnet" | "testnet";

function toPubkey(maybe?: string | null) {
  if (!maybe) return null;
  try {
    return new PublicKey(maybe);
  } catch {
    return null;
  }
}

/** Strict Solana Pay URL. Includes reference only if valid. Adds cluster hint for non-mainnet. */
export function makePayURL({
  recipient,
  amount,            // in SOL
  reference,
  label,
  message,
  splToken,
  cluster,           // NEW
}: {
  recipient: string;
  amount: number | string;
  reference?: string;
  label: string;
  message?: string;
  splToken?: string;
  cluster?: Cluster;
}) {
  const recipientPk = toPubkey(recipient);
  if (!recipientPk) throw new Error("Invalid recipient public key");

  const refPk = toPubkey(reference);
  const tokenPk = toPubkey(splToken);

  const amt = new BigNumber(amount).decimalPlaces(9, BigNumber.ROUND_DOWN);
  if (!amt.isFinite() || amt.lte(0)) throw new Error("Amount must be > 0");

  const url = encodeURL({
    recipient: recipientPk,
    amount: amt,
    ...(refPk ? { reference: refPk } : {}),
    ...(tokenPk ? { splToken: tokenPk } : {}),
    label,
    message,
  });

  // Append cluster hint for non-mainnet (some wallets honor this)
  if (cluster && cluster !== "mainnet-beta") {
    const u = new URL(url.toString());
    u.searchParams.set("cluster", cluster);
    return u;
  }
  return url;
}

/** Ultra‑compatible URL (no reference) but still include cluster hint. */
export function makeCompatURL({
  recipient,
  amount,
  label,
  message,
  splToken,
  cluster,          // NEW
}: {
  recipient: string;
  amount: number | string;
  label: string;
  message?: string;
  splToken?: string;
  cluster?: Cluster;
}) {
  return makePayURL({ recipient, amount, label, message, splToken, cluster });
}

/** Back-compat helper returning string. */
export function buildSolanaPayURL(args: {
  recipient?: string;
  receiver?: string; // legacy name
  amount: number | string;
  reference?: string;
  label: string;
  message?: string;
  splToken?: string;
  cluster?: Cluster;
}): string {
  const recipient = args.recipient || args.receiver;
  if (!recipient) throw new Error("recipient/receiver is required");
  return makePayURL({
    recipient,
    amount: args.amount,
    reference: args.reference,
    label: args.label,
    message: args.message,
    splToken: args.splToken,
    cluster: args.cluster,
  }).toString();
}
