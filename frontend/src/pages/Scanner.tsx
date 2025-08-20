// src/pages/Scanner.tsx
import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { redeemTicket } from '../lib/tickets';
// ...existing code...

export default function Scanner() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle, scanning, validating, success, failed
  const [scanMessage, setScanMessage] = useState("Ready to scan...");
  const [ticketIdInput, setTicketIdInput] = useState(""); // New state for manual input

  useEffect(() => {
    let scanner: QrScanner;
    if (videoRef.current) {
      scanner = new QrScanner(
        videoRef.current,
        (result) => handleScan(result.data),
        {
          onDecodeError: error => {
            setScanMessage("Scanning...");
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      scanner.start().then(() => setStatus("scanning"));
    }

    return () => {
      if (scanner) {
        scanner.stop();
        scanner.destroy();
      }
    };
  }, []);

  const handleScan = async (qrData: string) => {
    setStatus("validating");
    setScanMessage("Validating ticket...");

    try {
      let url;
      try {
        url = new URL(qrData);
      } catch (e) {
        throw new Error("Invalid QR code: Not a valid URL.");
      }
      const ticketId = url.searchParams.get("ticketId");
      const nonce = url.searchParams.get("nonce") || "manual_redeem";
      
      if (!ticketId) {
        throw new Error("Invalid QR code format. Missing ticketId.");
      }
      
      const result = await redeemTicket(ticketId, nonce);
      
      if (result.success) {
        setStatus("success");
        setScanMessage("Ticket redeemed successfully!");
      } else {
        throw new Error(result.message || "Redemption failed.");
      }
    } catch (error) {
      setStatus("failed");
      if (error instanceof Error) {
        setScanMessage(`Error: ${error.message}`);
      } else {
        setScanMessage("An unknown error occurred.");
      }
      setTimeout(() => {
        setStatus("scanning");
        setScanMessage("Ready to scan...");
      }, 3000);
    }
  };

  const handleManualRedeem = async () => {
    if (!ticketIdInput) {
      setScanMessage("Please enter a Ticket ID.");
      setStatus("failed");
      return;
    }
    
    setStatus("validating");
    setScanMessage("Validating ticket...");
    
    try {
      // Manual redemption will not have a nonce for this simple implementation
      // You would need to add a new backend endpoint for ID-only redemption
      const result = await redeemTicket(ticketIdInput, "manual_redeem"); 
      
      if (result.success) {
        setStatus("success");
        setScanMessage("Ticket redeemed successfully!");
      } else {
        throw new Error(result.message || "Redemption failed.");
      }
    } catch (error) {
      setStatus("failed");
      if (error instanceof Error) {
        setScanMessage(`Error: ${error.message}`);
      } else {
        setScanMessage("An unknown error occurred.");
      }
      setTimeout(() => {
        setStatus("scanning");
        setScanMessage("Ready to scan...");
      }, 3000);
    }
  };

  return (
    <>
    <div className="max-w-md mx-auto p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">Ticket Scanner</h2>
      
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`p-4 rounded-xl text-white font-bold transition-opacity duration-300 ${status === 'success' ? 'bg-green-500 opacity-90' : status === 'failed' ? 'bg-red-500 opacity-90' : 'opacity-0'}`}>
            {status === 'success' ? 'ADMITTED' : 'FAILED'}
          </div>
        </div>
      </div>
      <div className="mt-4 text-lg font-medium">{scanMessage}</div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-semibold mb-2">Or, Enter Ticket ID Manually</h3>
        <input 
          type="text" 
          value={ticketIdInput}
          onChange={(e) => setTicketIdInput(e.target.value)}
          placeholder="Enter Ticket ID" 
          className="w-full p-2 border rounded-md text-center" 
        />
        <button 
          onClick={handleManualRedeem}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Redeem Ticket
        </button>
      </div>
    </div>
    </>
  );
}