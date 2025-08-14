// src/pages/Scanner.tsx
import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { redeemTicket } from '../lib/tickets';

export default function Scanner() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle, scanning, validating, success, failed
  const [scanMessage, setScanMessage] = useState("Ready to scan...");

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
      const url = new URL(qrData);
      const ticketId = url.searchParams.get("ticketId");
      const nonce = url.searchParams.get("nonce");

      if (!ticketId || !nonce) {
        throw new Error("Invalid QR code format.");
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

  return (
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
    </div>
  );
}