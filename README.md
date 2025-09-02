# 🌐 Soluma: The Web3 Event Platform

> Soluma is a decentralized event management platform built on the Solana blockchain that redefines how events are organized, ticketed, and experienced. It's a Web3 alternative to platforms like Luma, providing a secure, transparent, and user-friendly solution for both organizers and attendees.

[🔴 Live Demo](https://example.com) | [📄 Pitch Deck](https://example.com)

---

## The Problem

Current event ticketing systems are centralized and lack transparency. Organizers face high platform fees, and attendees have no true ownership of their tickets. The traditional model is prone to ticket fraud, limited access to secondary markets, and a reliance on intermediaries who control funds and data. Web3 event solutions, while decentralized, often have a steep learning curve, alienating mainstream users with complex wallet setups and seed phrase management.

---

## The Solution: A Hybrid Web2 + Web3 Approach

Soluma bridges this gap by combining the speed and security of the Solana blockchain with a familiar, intuitive user interface. It provides the best of both worlds: a trustless, decentralized backbone that's hidden behind a seamless Web2-like experience.

**For Organizers:** Soluma offers a low-cost, transparent platform to create events, manage tickets, and verify attendance with absolute confidence.

**For Attendees:** It provides a simple way to purchase tickets using crypto, securely store them in a self-custodial wallet they don't even know they have, and gain entry with a simple QR scan. The "source of truth" is the public Solana ledger, not a private database.

---

## 🔑 Core Features

| Feature                       | Description                                                                                                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frictionless Onboarding** | Users sign up with their social accounts or email using **Web3Auth**, which instantly creates a non-custodial wallet for them. No more complicated key management.         |
| **Decentralized Payments** | Attendees pay for tickets using the **Solana Pay** protocol. This enables instant, low-fee transactions with SOL or any SPL token, directly from their wallet to the organizer's. |
| **On-Chain Ticket Verification** | Tickets are unique QR codes linked to an on-chain record. An **Express.js** backend securely verifies each scan by checking the blockchain for valid transactions, preventing double-use and fraud. |
| **Real-Time Organizer Dashboard** | Organizers get a live view of ticket sales, payment statuses, and attendee check-ins, all powered by real-time data from **Firebase Firestore** and the blockchain. |
| **Secure Wallet Management** | Users can easily access their Web3Auth-generated wallet from a personal dashboard, viewing balances and transaction history without needing a separate app or browser extension. |
| **Simplified Management** | All ticket and event metadata is efficiently stored on **Firebase**, while the critical payment and ownership data resides immutably on the **Solana** blockchain.        |

[Export to Sheets](https://example.com)

---

## ⚙️ How It Works: The Technical Flow

Soluma uses a hybrid architecture that ensures a flawless user experience while leveraging the benefits of a decentralized backend.

### Flow 1: Event Creation & Ticket Purchase

This flow shows how an organizer's input is transformed into a scannable, on-chain ticket.

1.  **Organizer Action (React):** An organizer logs in via Web3Auth and fills out the event details (title, price, etc.) on the React frontend.
2.  **Metadata Storage (Firebase):** The event details are saved to Firebase Firestore for easy retrieval.
3.  **Payment URL Generation (Express.js):** The backend generates a unique Solana Pay URL that includes the organizer's wallet address and the event's token amount.
4.  **QR Code Generation (Frontend):** The React frontend renders this URL as a scannable QR code. The event page is now ready for attendees.

### Flow 2: QR Code Scanning & Entry

This flow demonstrates the trustless verification process that happens in real time.

1.  **Attendee Action:** An attendee purchases a ticket by scanning the Solana Pay QR code and approving the transaction.
2.  **On-Chain Confirmation (Solana):** The payment is confirmed on the Solana blockchain.
3.  **Verification (Backend):** At the event, a staff member scans the attendee's ticket QR code. This triggers a call to the Express.js backend.
4.  **Secure Verification:** The backend cross-references the scanned QR data with the Firebase database and the Solana blockchain to confirm:
    - The transaction is valid.
    - The ticket has not already been used.
5.  **Access Granted:** Upon successful verification, the attendee is granted entry, and the ticket's status is updated to "used" in Firebase to prevent fraud.

---

## 🛠️ Tech Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **Backend:** Node.js, Express.js
-   **Blockchain:** Solana (`@solana/web3.js`, `@solana/spl-token`, `@solana/pay`)
-   **Authentication:** Web3Auth (`@web3auth/modal`)
-   **Database:** Firebase (Firestore, Storage)
-   **Storage:** Cloudinary (for image uploads)
-   **Routing:** `react-router-dom`

---

## 🚀 Getting Started & Running the Demo

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js & npm installed
-   A Solana wallet with SOL and SPL tokens for testing
-   A Firebase project with Firestore enabled
-   A Web3Auth project to get your Client ID
-   A Cloudinary account for image hosting

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your_username/soluma.git](https://github.com/your_username/soluma.git)
    cd soluma
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
3.  **Navigate to the backend directory and install dependencies:**
    ```bash
    cd backend
    npm install
    ```
4.  **Set up environment variables:**

    Create a `.env` file in your frontend root and add the following:
    ```
    VITE_WEB3AUTH_CLIENT_ID=...
    VITE_RPC=...
    VITE_CLUSTER=...
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    VITE_FIREBASE_STORAGE_BUCKET=...
    VITE_FIREBASE_MESSAGING_SENDER_ID=...
    VITE_FIREBASE_APP_ID=...
    VITE_CLOUD_NAME=...
    VITE_API_BASE_URL=...
    ```
    Create a `.env` file in your backend root and add the following:
    ```
    FIREBASE_SERVICE_ACCOUNT_KEY=...
    ALLOWED_ORIGINS=...
    CLOUDINARY_API_KEY=...
    CLOUDINARY_API_SECRET=...
    ```
5.  **Run the development servers:**
    -   In the frontend directory: `npm run dev`
    -   In the backend directory: `node server.js`

---

## 🤝 Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🧑‍💻 The Team

-   Your Name
-   Collaborator's Name
