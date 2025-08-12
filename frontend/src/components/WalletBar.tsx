import React from "react";
import { useWeb3AuthConnect, useWeb3AuthDisconnect } from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";

const WalletBar: React.FC = () => {
  const {
    connect,
    isConnected,
    connectorName,
    loading: connectLoading,
    error: connectError,
  } = useWeb3AuthConnect();

  const {
    disconnect,
    loading: disconnectLoading,
    error: disconnectError,
  } = useWeb3AuthDisconnect();

  const { accounts } = useSolanaWallet();
  const addressAvailable = accounts && accounts.length > 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 16,
        borderBottom: "1px solid #eef",
        padding: "8px 24px",
        fontFamily: "monospace",
        background: "#f6f8fa",
      }}
    >
      {addressAvailable && (
        <span style={{ fontWeight: 500 }}>
          {accounts[0].slice(0, 6)}...{accounts[0].slice(-4)}
        </span>
      )}
      {!isConnected ? (
        <button
          style={{
            padding: "7px 22px",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
            background: "#206bc4",
            color: "#fff",
            border: "none",
          }}
          disabled={connectLoading}
          onClick={connect}
        >
          {connectLoading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <button
          style={{
            padding: "7px 22px",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
            background: "#fee",
            color: "#b00",
            border: "none",
          }}
          disabled={disconnectLoading}
          onClick={() => disconnect({ cleanup: true })}
        >
          {disconnectLoading ? "Disconnecting..." : "Log Out"}
        </button>
      )}
      {connectError && <span style={{ color: "#b00" }}>{connectError.message}</span>}
      {disconnectError && <span style={{ color: "#b00" }}>{disconnectError.message}</span>}
    </div>
  );
};

export default WalletBar;
