import * as functions from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { Connection, PublicKey } from '@solana/web3.js';
import { CallableRequest } from 'firebase-functions/v2/https';

admin.initializeApp();
const db = admin.firestore();

const SOLANA_RPC = 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC, 'confirmed');

interface VerifyOrderData {
  orderId: string;
  txSig: string;
  reference: string;
  buyerWallet: string;
}

export const verifyOrder = functions.onCall(async (request: CallableRequest<VerifyOrderData>) => {
  if (!request.auth) {
    throw new functions.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { orderId, txSig, reference, buyerWallet } = request.data;

  if (!orderId || !txSig || !reference || !buyerWallet) {
    throw new functions.HttpsError('invalid-argument', 'Missing required parameters.');
  }

  const orderRef = db.collection('orders').doc(orderId);
  const orderSnap = await orderRef.get();

  if (!orderSnap.exists) {
    throw new functions.HttpsError('not-found', 'Order not found.');
  }

  const order = orderSnap.data();
  if (!order) {
    throw new functions.HttpsError('internal', 'Order data is corrupt.');
  }
  
  try {
    const tx = await connection.getTransaction(txSig, { maxSupportedTransactionVersion: 0 });
    
    if (!tx || !tx.meta) {
      await orderRef.update({ status: 'failed', txSig });
      throw new functions.HttpsError('failed-precondition', 'Transaction not found or confirmed.');
    }

    const destinationPubkey = new PublicKey(order.receiverWallet);
    const keys = tx.transaction.message.getAccountKeys();
    const destinationIndex = keys.staticAccountKeys.findIndex(key => key.equals(destinationPubkey));

    if (destinationIndex === -1) {
      await orderRef.update({ status: 'failed', txSig });
      throw new functions.HttpsError('failed-precondition', 'Destination address mismatch.');
    }

    const preBalance = tx.meta.preBalances[destinationIndex] || 0;
    const postBalance = tx.meta.postBalances[destinationIndex] || 0;
    const transferAmount = postBalance - preBalance;

    if (transferAmount !== order.amountLamports) {
      await orderRef.update({ status: 'failed', txSig });
      throw new functions.HttpsError('failed-precondition', 'Amount mismatch.');
    }

  } catch (err) {
    console.error('Solana verification failed:', err);
    if (err instanceof Error) {
      throw new functions.HttpsError('internal', `Solana RPC verification failed: ${err.message}`);
    } else {
      throw new functions.HttpsError('internal', `Solana RPC verification failed: An unknown error occurred.`);
    }
  }

  const batch = db.batch();
  batch.update(orderRef, { status: 'paid', txSig, buyerWallet });

  const ticketIds: string[] = [];
  for (let i = 0; i < order.qty; i++) {
    const ticketRef = db.collection('tickets').doc();
    batch.set(ticketRef, {
      eventId: order.eventId,
      orderId: orderId,
      ownerWallet: buyerWallet,
      status: 'issued',
      qrTokenHash: 'initial_hash',
      redeemedAt: null,
    });
    ticketIds.push(ticketRef.id);
  }

  const eventRef = db.collection('events').doc(order.eventId);
  batch.update(eventRef, { salesCount: admin.firestore.FieldValue.increment(order.qty) });

  await batch.commit();

  return { ticketIds };
});