import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export async function payWithConnectedWallet({
  conn,
  signer,          // from makeSigner()
  fromPubkey,
  receiver,
  amountSol,
  reference,
}: {
  conn: Connection;
  signer: any;
  fromPubkey: PublicKey;
  receiver: string;
  amountSol: number;
  reference: string;
}) {
  const ix = SystemProgram.transfer({
    fromPubkey,
    toPubkey: new PublicKey(receiver),
    lamports: Math.round(amountSol * 1e9),
  });

  // add Solana Pay reference as readonly, non-signer key
  ix.keys.push({
    pubkey: new PublicKey(reference),
    isSigner: false,
    isWritable: false,
  });

  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
  const tx = new Transaction({ feePayer: fromPubkey, recentBlockhash: blockhash }).add(ix);

  if (signer.signAndSendTransaction) {
    const { signature } = await signer.signAndSendTransaction(tx);
    await conn.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
    return signature;
  }

  // fallback if your provider only supports signTransaction
  const signed = await signer.signTransaction(tx);
  const sig = await conn.sendRawTransaction(signed.serialize());
  await conn.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });
  return sig;
}
