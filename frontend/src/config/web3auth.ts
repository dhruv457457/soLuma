import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import type { Web3AuthContextConfig } from "@web3auth/modal/react";

const CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENT_ID as string;

// Use a reliable RPC for Solana Devnet
const RPC = "https://api.devnet.solana.com"; 

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: CLIENT_ID,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.SOLANA,
      chainId: "0x3", // devnet
      rpcTarget: RPC,
      displayName: "Solana Devnet",
      blockExplorerUrl: "https://explorer.solana.com?cluster=devnet",
      ticker: "SOL",
      tickerName: "Solana",
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,

    // 👇 Add this block to fix the "Dapp logo is required" error
    whiteLabel: {
      name: "My Solana DApp",
      logoLight: "https://yourdomain.com/logo.png", // ✅ must be a hosted image, not localhost
      logoDark: "https://yourdomain.com/logo.png",
      defaultLanguage: "en",
      mode: "dark", // or "light"
    },
  },

  // Modal config: only show email login (Google, etc.)
  modalConfig: {
    openlogin: { label: "email", showOnModal: true },
    metamask: { showOnModal: false },
    walletconnectv2: { showOnModal: false },
    coinbase: { showOnModal: false },
    torusEvm: { showOnModal: false },
    phantom: { showOnModal: false },
    solflare: { showOnModal: false },
    torusSolana: { showOnModal: false },
  },
} as any;

export default web3AuthContextConfig;
