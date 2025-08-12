import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import type { Web3AuthContextConfig } from "@web3auth/modal/react";

const CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENT_ID as string;

// Start with a vanilla, reliable RPC until everything connects.
// Once stable, you can switch to Alchemy again.
const RPC = "https://api.devnet.solana.com"; // or "https://rpc.ankr.com/solana_devnet"

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
  },
  // Hide EVM/external to avoid EIP-155 noise
  modalConfig: {
    openlogin: { label: "email", showOnModal: true },
    metamask: { showOnModal: false },
    walletconnectv2: { showOnModal: false },
    coinbase: { showOnModal: false },
    torusEvm: { showOnModal: false },
    // optional: hide other solana adapters if you want only embedded
    phantom: { showOnModal: false },
    solflare: { showOnModal: false },
    torusSolana: { showOnModal: false },
  },
} as any;

export default web3AuthContextConfig;
