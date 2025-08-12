frontend/
├─ .env
├─ .gitignore
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
│
├─ public/
│  ├─ favicon.ico
│  └─ logo.svg
│
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ index.css
│  │
│  ├─ config/
│  │  ├─ web3auth.ts              // uses VITE_WEB3AUTH_CLIENT_ID, VITE_RPC, VITE_CLUSTER
│  │  ├─ solana.ts                // createConnection(), exports RPC/CLUSTER
│  │  └─ firebase.ts              // firebase init + ensureFirebaseAuth()
│  │
│  ├─ types/
│  │  └─ ticketing.ts             // EventDoc, OrderDoc, TicketDoc, Currency
│  │
│  ├─ lib/
│  │  ├─ solanapay.ts             // makePayURL(), makeCompatURL() (TS)
│  │  ├─ pay-desktop.ts           // your desktop signer helpers (TS)
│  │  ├─ signer.ts                // makeSigner / embedded signer helpers (TS)
│  │  ├─ format.ts                // number/date utils
│  │  └─ api.ts                   // thin fetch wrapper for API_BASE (future backend)
│  │
│  ├─ data/                       // (optional) local mocks for dev
│  │  └─ events.mock.ts
│  │
│  ├─ hooks/
│  │  ├─ useAuth.ts               // wraps ensureFirebaseAuth + returns uid/email
│  │  ├─ useWallet.ts             // wraps Web3Auth hooks (accounts, connected)
│  │  └─ useInterval.ts           // handy utility for timers
│  │
│  ├─ components/
│  │  ├─ NavBar.tsx
│  │  ├─ WalletBar.tsx
│  │  ├─ PaymentQR.tsx
│  │  ├─ EventCard.tsx
│  │  ├─ TicketCard.tsx
│  │  └─ ScannerView.tsx          // decodes QR and calls verify/redeem (when backend exists)
│  │
│  ├─ pages/
│  │  ├─ Home.tsx                 // / — lists events (mock for now)
│  │  ├─ EventsList.tsx           // /events — same as Home or filtered
│  │  ├─ EventDetails.tsx         // /e/:id — buy/checkout (shows QR link or desktop pay button)
│  │  ├─ EventCheckout.tsx        // /checkout/:eventId — transaction request flow
│  │  ├─ MyTickets.tsx            // /tickets — lists user’s tickets (mock placeholders now)
│  │  ├─ TicketView.tsx           // /tickets/:ticketId — big single-use QR renderer
│  │  ├─ Scanner.tsx              // /scan — staff scanner page
│  │  ├─ CreateEvent.tsx          // /org/events — simple create form (Firestore direct for now)
│  │  ├─ OrgEventDashboard.tsx    // /org/events/:id — sales list (FireStore reads for now)
│  │  └─ NotFound.tsx
│  │
│  ├─ router/
│  │  └─ index.tsx                // central route config
│  │
│  └─ vite-env.d.ts
