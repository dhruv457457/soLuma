paypact/
├─ .env.local                         # VITE_WEB3AUTH_CLIENT_ID, VITE_RPC, VITE_HELIUS_KEY, etc.
├─ .gitignore
├─ index.html
├─ package.json
├─ README.md
├─ tailwind.config.ts                 # (Tailwind v4) optional if you want custom theme
├─ tsconfig.json
├─ vite.config.ts
├─ public/
│  └─ favicon.svg
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ index.css                       # `@import "tailwindcss";` (v4)
   │
   ├─ config/
   │  ├─ solana.ts                    # exports `connection` (devnet by default)
   │  └─ web3auth.ts                  # Web3Auth modal config (devnet)
   │
   ├─ types/
   │  └─ index.ts                     # Pact, Participant, User, PaymentStatus types
   │
   ├─ lib/
   │  ├─ solanapay.ts                 # buildSolanaPayURL(), helpers
   │  ├─ api.ts                       # axios/fetch wrapper for your backend
   │  ├─ validators.ts                # zod schemas for pact/participant (optional)
   │  ├─ db.ts                        # pick one: Firebase / Supabase client (optional)
   │  └─ helius.ts                    # client helpers (polling) if you don’t use webhooks
   │
   ├─ hooks/
   │  ├─ useAuth.ts                   # wraps @web3auth/modal/react hooks (login/logout, wallet addr)
   │  ├─ usePacts.ts                  # CRUD pact + participants via backend/DB
   │  └─ usePaymentTracking.ts        # poll by reference (fallback if no webhook)
   │
   ├─ store/                          # (optional) zustand for UI state
   │  └─ ui.ts
   │
   ├─ utils/
   │  ├─ format.ts                    # formatAmount, shortAddr, dates
   │  └─ refs.ts                      # generateReferencePubkey()
   │
   ├─ components/
   │  ├─ WalletBar.tsx                # Web3Auth connect/disconnect + address chip
   │  ├─ NavBar.tsx
   │  ├─ PaymentQR.tsx                # QRCode for a Solana Pay URL
   │  ├─ PactTable.tsx                # simple table for participants + statuses
   │  ├─ StatusBadge.tsx              # Paid / Unpaid / Late
   │  └─ Loader.tsx
   │
   └─ pages/
      ├─ Home.tsx                     # login + basic wallet demo (keep)
      ├─ CreatePact.tsx               # DB-only: name, amount, receiver, participants, due date
      ├─ PactDetails.tsx              # per-participant card with unique QR + status
      ├─ OrganizerDashboard.tsx       # list of pacts, totals, reminder buttons
      └─ NotFound.tsx
