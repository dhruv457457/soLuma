require('dotenv').config();
// backend/server.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const { Connection, PublicKey } = require('@solana/web3.js');

// Load the service account key from an environment variable
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountJson) {
  console.error('Error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  process.exit(1);
}
const serviceAccount = JSON.parse(serviceAccountJson);

// Initialize Firebase Admin SDK with project details
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://soluma-faa71.firebaseio.com`,
  storageBucket: `soluma-faa71.appspot.com`,
});

const db = admin.firestore();
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const SOLANA_RPC = 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC, 'confirmed');

// Define the backend API route for order creation
app.post('/api/orders.create', async (req, res) => {
  try {
    const { eventId, buyerWallet, reference, qty, amountLamports, currency, receiverWallet } = req.body;
    
    if (!eventId || !buyerWallet || !reference) {
      return res.status(400).json({ message: "Missing required parameters for order creation." });
    }

    const orderPayload = {
      eventId,
      buyerWallet,
      reference,
      qty,
      amountLamports,
      currency,
      receiverWallet,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const orderRef = await db.collection('orders').add(orderPayload);
    res.status(201).json({ orderId: orderRef.id });

  } catch (error) {
    console.error('Order creation API Error:', error);
    res.status(500).json({ message: error.message || "An unknown error occurred." });
  }
});

// Define the backend API route for order verification
app.post('/api/orders.verify', async (req, res) => {
  try {
    const { orderId, txSig, reference, buyerWallet } = req.body;

    if (!orderId || !txSig || !reference || !buyerWallet) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.status(404).json({ message: "Order not found." });
    }

    const order = orderSnap.data();
    if (!order) {
      return res.status(500).json({ message: 'Order data is corrupt.' });
    }

    const tx = await connection.getTransaction(txSig, { maxSupportedTransactionVersion: 0 });

    if (!tx || !tx.meta) {
      await orderRef.update({ status: 'failed', txSig });
      return res.status(400).json({ message: 'Transaction not found or confirmed.' });
    }

    const destinationPubkey = new PublicKey(order.receiverWallet);
    const keys = tx.transaction.message.getAccountKeys();
    const destinationIndex = keys.staticAccountKeys.findIndex(key => key.equals(destinationPubkey));

    if (destinationIndex === -1) {
      await orderRef.update({ status: 'failed', txSig });
      return res.status(400).json({ message: 'Destination address mismatch.' });
    }

    const preBalance = tx.meta.preBalances[destinationIndex] || 0;
    const postBalance = tx.meta.postBalances[destinationIndex] || 0;
    const transferAmount = postBalance - preBalance;

    if (transferAmount !== order.amountLamports) {
      await orderRef.update({ status: 'failed', txSig });
      return res.status(400).json({ message: 'Amount mismatch.' });
    }

    const batch = db.batch();
    batch.update(orderRef, { status: 'paid', txSig, buyerWallet });

    const ticketIds = [];
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

    res.status(200).json({ ticketIds });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: error.message || "An unknown error occurred." });
  }
});

// Define the backend API route for getting a single ticket
app.post('/api/tickets.get', async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) {
      return res.status(400).json({ message: "Ticket ID is required." });
    }

    const ticketRef = db.collection('tickets').doc(ticketId);
    const ticketSnap = await ticketRef.get();

    if (!ticketSnap.exists) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    const ticket = { id: ticketSnap.id, ...ticketSnap.data() };
    res.status(200).json({ ticket });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: error.message || "An unknown error occurred." });
  }
});

// Define the backend API route for fetching all tickets for a user
app.post('/api/tickets.list', async (req, res) => {
  try {
    const { ownerWallet } = req.body;
    if (!ownerWallet) {
      return res.status(400).json({ message: "Owner wallet is required." });
    }

    const q = db.collection('tickets').where('ownerWallet', '==', ownerWallet);
    const snapshot = await q.get();

    const tickets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const ticketsWithEvents = await Promise.all(tickets.map(async (ticket) => {
      const eventRef = db.collection('events').doc(ticket.eventId);
      const eventSnap = await eventRef.get();
      const event = eventSnap.exists ? eventSnap.data() : {};
      return { ...ticket, event };
    }));

    res.status(200).json({ tickets: ticketsWithEvents });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: error.message || "An unknown error occurred." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
// Define the backend API route for ticket redemption
// backend/server.js
// ... (existing code)

// Define the backend API route for ticket redemption
app.post('/api/tickets.redeem', async (req, res) => {
  try {
    const { ticketId, nonce } = req.body;
    if (!ticketId) {
      return res.status(400).json({ success: false, message: "Ticket ID is required." });
    }

    const ticketRef = db.collection('tickets').doc(ticketId);
    const ticketSnap = await ticketRef.get();

    if (!ticketSnap.exists) {
      return res.status(404).json({ success: false, message: "Ticket not found." });
    }

    const ticket = ticketSnap.data();
    if (!ticket) {
      return res.status(500).json({ success: false, message: 'Ticket data is corrupt.' });
    }

    if (ticket.status === 'redeemed') {
      return res.status(400).json({ success: false, message: "Ticket has already been redeemed." });
    }

    // Check for a valid nonce unless it's a manual redemption
    if (nonce !== "manual_redeem" && ticket.qrTokenHash !== nonce) {
        return res.status(400).json({ success: false, message: "Invalid ticket nonce or QR code." });
    }

    await ticketRef.update({
      status: 'redeemed',
      redeemedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ success: true, message: "Ticket redeemed successfully!" });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, message: error.message || "An unknown error occurred." });
  }
});

// ... (existing code)