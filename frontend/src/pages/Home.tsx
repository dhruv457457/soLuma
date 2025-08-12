import React, { useState, useEffect } from "react";
import { useWeb3AuthConnect, useWeb3AuthDisconnect } from "@web3auth/modal/react";
import { useSolanaWallet, useSignAndSendTransaction } from "@web3auth/modal/react/solana";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export default function Home() {
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

  const { accounts, connection } = useSolanaWallet();
  const {
    signAndSendTransaction,
    loading: txLoading,
    error: txError,
    data: txSignature,
  } = useSignAndSendTransaction();

  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const addressAvailable = accounts && accounts.length > 0;

  // Copy wallet address
  const copyAddressToClipboard = async () => {
    if (addressAvailable && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(accounts[0]);
        alert("Wallet address copied!");
      } catch {
        alert("Failed to copy address");
      }
    }
  };

  const fetchBalance = async () => {
    setBalanceError(null);
    if (connection && addressAvailable) {
      try {
        setLoadingBalance(true);
        const lamports = await connection.getBalance(new PublicKey(accounts[0]));
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (err: any) {
        setBalanceError(err?.message || "Balance fetch error");
        setBalance(null);
      } finally {
        setLoadingBalance(false);
      }
    } else {
      setBalance(null);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [connection, accounts]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addressAvailable || !connection) return;
    if (!toAddress || !amount) return;

    try {
      const fromPubkey = new PublicKey(accounts[0]);
      const toPubkey = new PublicKey(toAddress);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const tx = new Transaction({
        blockhash,
        lastValidBlockHeight,
        feePayer: fromPubkey,
      }).add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: Math.round(Number(amount) * LAMPORTS_PER_SOL),
        })
      );

      await signAndSendTransaction(tx);
      await fetchBalance();
      setToAddress("");
      setAmount("");
    } catch (err) {
      console.error("Transaction send error:", err);
    }
  };

  return (
    <div
      style={{
        maxWidth: 450,
        margin: "30px auto",
        padding: 24,
        borderRadius: 15,
        background: "#fcfcfc",
        boxShadow: "0 4px 24px #eee",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <h2 style={{ color: "#206bc4", marginBottom: 24 }}>
        Web3Auth Solana Embedded Wallet Demo
      </h2>

      {addressAvailable && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            backgroundColor: "#eef3fc",
            borderRadius: 8,
            padding: "8px 12px",
            fontFamily: "monospace",
            fontSize: "0.95rem",
          }}
        >
          <span title={accounts[0]} style={{ overflowWrap: "anywhere" }}>
            {accounts[0]}
          </span>
          <button
            onClick={copyAddressToClipboard}
            style={{
              marginLeft: 12,
              cursor: "pointer",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#206bc4",
              color: "#fff",
              fontWeight: 600,
              padding: "4px 12px",
            }}
          >
            Copy
          </button>
        </div>
      )}

      {!isConnected ? (
        <button
          style={{
            marginTop: 8,
            marginBottom: 12,
            padding: "10px 26px",
            fontWeight: 600,
            borderRadius: 10,
            cursor: "pointer",
          }}
          disabled={connectLoading}
          onClick={connect}
        >
          {connectLoading ? "Connecting..." : "Login with Web3Auth"}
        </button>
      ) : (
        <button
          style={{
            marginTop: 8,
            marginBottom: 18,
            padding: "10px 26px",
            borderRadius: 10,
            fontWeight: 600,
            cursor: "pointer",
            background: "#fee",
            color: "#b00",
          }}
          disabled={disconnectLoading}
          onClick={() => disconnect({ cleanup: true })}
        >
          {disconnectLoading ? "Disconnecting..." : "Log Out"}
        </button>
      )}

      {/* Wallet Info */}
      <div style={{ marginBottom: 12 }}>
        <div>
          <b>Status:</b>{" "}
          <span style={{ color: isConnected ? "green" : "#888" }}>
            {isConnected
              ? `Connected (${connectorName || "Web3Auth"})`
              : "Not Connected"}
          </span>
        </div>

        <div>
          <b>Balance:</b>{" "}
          {loadingBalance
            ? "Loading..."
            : balance !== null
            ? `${balance.toFixed(4)} SOL`
            : balanceError
            ? `Err: ${balanceError}`
            : "--"}
          {addressAvailable && (
            <button
              onClick={fetchBalance}
              style={{
                fontSize: 12,
                marginLeft: 8,
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Errors */}
      {connectError && (
        <div style={{ color: "#b00", marginBottom: 4 }}>
          Connect Error: {connectError.message}
        </div>
      )}
      {disconnectError && (
        <div style={{ color: "#b00", marginBottom: 4 }}>
          Disconnect Error: {disconnectError.message}
        </div>
      )}


      {isConnected && addressAvailable && (
        <form
          onSubmit={handleSend}
          style={{
            margin: "20px 0 16px 0",
            padding: 12,
            border: "1px solid #e5eaf0",
            borderRadius: 8,
            background: "#f8fbff",
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 6 }}>Send SOL</div>
          <input
            type="text"
            style={{
              width: "100%",
              marginBottom: 5,
              padding: "6px 8px",
              border: "1px solid #d1e3fa",
              borderRadius: 6,
            }}
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Recipient address"
            required
          />
          <input
            type="number"
            style={{
              width: "100%",
              marginBottom: 5,
              padding: "6px 8px",
              border: "1px solid #d1e3fa",
              borderRadius: 6,
            }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.0001"
            min="0.00001"
            placeholder="Amount (SOL)"
            required
          />
          <button
            type="submit"
            style={{
              padding: "8px 18px",
              fontWeight: 500,
              background: "#49b75f",
              color: "#fff",
              borderRadius: 6,
              cursor: "pointer",
            }}
            disabled={txLoading}
          >
            {txLoading ? "Sending..." : "Send"}
          </button>
          {txSignature && (
            <div style={{ marginTop: 7, fontSize: 13 }}>
              ✅ Sent! Tx Sig: {txSignature}
            </div>
          )}
          {txError && (
            <div style={{ color: "#b00", marginTop: 5 }}>{txError.message}</div>
          )}
        </form>
      )}
    </div>
  );
}
