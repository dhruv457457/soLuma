// server.js
require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors'); // <-- Keep this
const { Connection, PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddressSync } = require('@solana/spl-token');

// --- START: CORS Configuration Changes ---

// 1. Read the allowed origins from your .env file
const allowedOriginsString = process.env.ALLOWED_ORIGINS;
if (!allowedOriginsString) {
  console.error('Error: ALLOWED_ORIGINS environment variable is not set.');
  process.exit(1);
}
const allowedOrigins = allowedOriginsString.split(',');

// 2. Create the CORS options object
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like server-to-server or REST tools)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Optional: If you need to send cookies or authorization headers
};

// --- END: CORS Configuration Changes ---


// Firebase Admin setup
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountJson) {
 console.error('Error: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
 process.exit(1);
}
const serviceAccount = JSON.parse(serviceAccountJson);

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 databaseURL: `https://soluma-faa71.firebaseio.com`,
 storageBucket: `soluma-faa71.appspot.com`,
});

const db = admin.firestore();
const app = express();
app.use(express.json());

// 3. Use the new corsOptions in your app
app.use(cors(corsOptions)); // <-- This replaces the old cors line

const SOLANA_RPC = 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC, 'confirmed');

// ... ALL YOUR OTHER API ROUTES REMAIN THE SAME ...

// Order creation
app.post('/api/orders.create', async (req, res) => {
 try {
 const { eventId, buyerWallet, reference, qty, amountLamports, currency, receiverWallet, splToken } = req.body;
 if (!eventId || !buyerWallet || !reference) {
 return res.status(400).json({ message: "Missing required parameters for order creation." });
 }

     // CRITICAL CHANGE: Conditionally add splToken to the payload
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
     
     if (splToken) {
         orderPayload.splToken = splToken;
     }

 const orderRef = await db.collection('orders').add(orderPayload);
 res.status(201).json({ orderId: orderRef.id });
 } catch (error) {
 console.error('Order creation API Error:', error);
 res.status(500).json({ message: error.message || "An unknown error occurred." });
}
});

// Order verification (SOL + SPL)
app.post('/api/orders.verify', async (req, res) => {
 try {
 const { orderId, txSig, buyerWallet } = req.body;

 if (!orderId || !txSig || !buyerWallet) {
 return res.status(400).json({ message: "Missing required parameters." });
 }

 const orderRef = db.collection('orders').doc(orderId);
 const orderSnap = await orderRef.get();

 if (!orderSnap.exists) {
 return res.status(404).json({ message: "Order not found." });
 }

 // Mark order paid without deep verification (simplified MVP)
 await orderRef.update({ status: 'paid', txSig, buyerWallet });

 // Issue tickets same as before
 const order = orderSnap.data();
 const batch = db.batch();

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

 return res.status(200).json({ ticketIds });
 } catch (error) {
 console.error('Simplified API Error:', error);
 return res.status(500).json({ message: error.message || "An unknown error occurred." });
 }
});




// Tickets, Listing, Event fetch
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
       if (nonce !== "manual_redeem" && ticket.qrTokenHash !== nonce) {
         return res.status(400).json({ success: false, message: "Invalid ticket nonce or QR code." });
       }
   
       // Get a reference to the order associated with this ticket
       const orderRef = db.collection('orders').doc(ticket.orderId);
   
       // Use a transaction to update both the ticket and the order atomically
       await db.runTransaction(async (transaction) => {
         // 1. Update the ticket status to 'redeemed'
         transaction.update(ticketRef, {
           status: 'redeemed',
           redeemedAt: admin.firestore.FieldValue.serverTimestamp(),
         });
   
         // 2. Update the order's check-in status
         transaction.update(orderRef, {
           checkInStatus: 'checked-in',
           checkInTime: Date.now(), // Records the time of check-in
         });
       });
   
       res.status(200).json({ success: true, message: "Ticket redeemed successfully!" });
     } catch (error) {
       console.error('API Error:', error);
       res.status(500).json({ success: false, message: error.message || "An unknown error occurred." });
     }
   });


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
 console.log(`Backend server running on http://localhost:${PORT}`);
});