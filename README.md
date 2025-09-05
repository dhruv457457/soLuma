# 🌐 Soluma: The Web3 Event Platform

A decentralized event platform that combines a seamless Web2 user experience with the power of the Solana blockchain. No seed phrases, no complexity—just events.

**Follow our Hackathon Journey for the #SocialMediaPrize! 🐦**
**[https://x.com/SoLuma_X](https://x.com/SoLuma_X)**

| [🔴 Live Demo](https://soluma.vercel.app/) | [📄 Pitch Deck](https://gamma.app/docs/Soluma-The-Web3-Event-Platform-l0onzh91an2dum7?mode=doc) | [📂 GitHub Repo](https://github.com/dhruv457457/soLuma) |
|---|---|---|

---

## ✨ Hackathon Submission: MetaMask Embedded Wallets & Solana Dev Cook-Off

This project is a submission for the **MetaMask Embedded Wallets & Solana Dev Cook-Off**. Soluma is built from the ground up to reimagine Web3 UX by making decentralized technology invisible to the end-user, perfectly aligning with the hackathon's theme.

### 🏆 Targeted Prize Tracks

We are primarily competing for the following tracks where Soluma excels:

* **🥇 Solana Everyday Impact: Consumer & Community App**
    * **Why?** Soluma is a practical consumer application that makes a common activity—event ticketing—more democratic, secure, and user-empowering on Solana. It's designed for mainstream adoption.

* **🥇 Best Use of Solana Pay**
    * **Why?** Solana Pay is the core of our payment and ticketing mechanism. We use it not just for payments but as the foundation for generating verifiable, on-chain tickets via QR codes.

---

## 🎯 The Problem

Event ticketing is centralized, expensive for organizers, and insecure for attendees. Traditional platforms control user data, charge high fees, and suffer from fraud. Existing Web3 solutions are often too complex for everyday users, requiring browser extensions and seed phrase management.

## ✅ Our Solution: Soluma

Soluma solves this by offering a hybrid Web2 + Web3 platform. We use **MetaMask Embedded Wallets (via the Web3Auth SDK)** to provide a frictionless, "seedless" onboarding experience. Users sign up with an email or social account and get a non-custodial Solana wallet without even knowing it.

-   **For Organizers:** Create events and receive payments directly to your wallet in seconds with near-zero fees.
-   **For Attendees:** Buy tickets with a simple QR scan using **Solana Pay**. Your ticket is a secure, on-chain asset you truly own.

---

## 📋 How We Meet the Hackathon Requirements

| Requirement | How Soluma Meets It |
| :--- | :--- |
| **MetaMask Embedded Wallet SDK** | ✅ **Integrated.** We use the `@web3auth/modal` React SDK for instant, seedless wallet creation via social/email logins. Users never see a seed phrase. |
| **Deployed on Solana** | ✅ **Deployed.** The entire ticketing and payment logic is built on the Solana Devnet, leveraging its speed and low transaction costs. |
| **Working Demo** | ✅ **Available.** A live demo is linked above, showcasing the full user flow from event creation to ticket verification. |
| **Source Code Access** | ✅ **Public.** The complete source code is available in this repository with clear setup instructions. |
| **Pitch & Documentation** | ✅ **Included.** This README serves as our documentation and pitch, outlining the problem, solution, and technical execution. |

---

## 🛠️ Technical Architecture & Key Features

Soluma's hybrid architecture uses Firebase for non-critical metadata and the **Solana blockchain as the single source of truth** for payments and ticket ownership.

### User Flow
1.  **Onboarding (Web3Auth):** A user signs up with their email. Web3Auth instantly generates a non-custodial Solana wallet in the background.
2.  **Event Creation (React/Firebase):** An organizer creates an event. The details are stored in Firestore.
3.  **Payment URL (Node.js/Solana Pay):** Our backend generates a unique Solana Pay URL for the ticket price, pointing to the organizer's wallet.
4.  **Purchase (Solana Pay):** An attendee scans the QR code and approves the transaction from any Solana wallet.
5.  **Verification (Node.js/Solana):** At the venue, an organizer scans the attendee's QR ticket. Our backend verifies the transaction signature on the Solana blockchain in real-time to grant entry. This prevents fraud and double-spending.

### Code Highlights

#### 1. Frictionless Onboarding with Web3Auth
We configured the Web3Auth modal to create a Solana-native wallet and hide all complex/irrelevant options, ensuring a pure Web2-like experience.

```typescript
// src/config/web3auth.ts
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";

export const web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: VITE_WEB3AUTH_CLIENT_ID,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.SOLANA,
      chainId: "0x3", // Solana Devnet
      rpcTarget: "[https://api.devnet.solana.com](https://api.devnet.solana.com)",
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  },
  // Hide all external wallet options to create a seamless embedded experience
  modalConfig: {
    openlogin: { label: "email", showOnModal: true },
    metamask: { showOnModal: false },
    phantom: { showOnModal: false },
    // ... other wallets hidden
  },
};

```
#### 2. Dynamic Solana Pay URL Generation
We create transaction requests on the fly, embedding event and payment details directly into the QR code. This is central to our "Best Use of Solana Pay" claim.

```typescript
// src/lib/solanapay.ts (simplified)
import { encodeURL } from "@solana/pay";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";

function makePayURL({ recipient, amount, reference, splToken }) {
  const recipientPk = new PublicKey(recipient);
  const refPk = new PublicKey(reference); // Reference links the payment to the order
  const tokenPk = splToken ? new PublicKey(splToken) : undefined;
  
  const url = encodeURL({
    recipient: recipientPk,
    amount: new BigNumber(amount),
    splToken: tokenPk,
    reference: refPk,
    label: "Soluma Event Ticket",
  });
  return url;
}
```
---

## 🚀 Getting Started

### Prerequisites
-   Node.js & npm
-   A Firebase project with Firestore enabled
-   A Web3Auth project Client ID
-   A Cloudinary account for image hosting

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Dhruv-2003/Soluma.git](https://github.com/Dhruv-2003/Soluma.git)
    cd soluma
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
3.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```
4.  **Set up environment variables:**
    -   Create a `.env` file in the frontend root and populate it with your keys (Firebase, Web3Auth, etc.).
    -   Create a `.env` file in the backend root and populate it.

5.  **Run the development servers:**
    -   In the frontend directory: `npm run dev`
    -   In the backend directory: `node server.js`

---

## 🧑‍💻 The Team
* **Dhruv Pancholi** ([dpancholi.pp123@gmail.com](mailto:dpancholi.pp123@gmail.com))
* **Nitin Jain**

---

