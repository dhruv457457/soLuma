import React, { useEffect, useRef } from "react";
import { createQR } from "@solana/pay";

export default function PaymentQR({ url }: { url: string }) {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qrRef.current && url) {
      const qr = createQR(url, 220);
      qrRef.current.innerHTML = ''; // Clear previous QR code if it exists
      qr.append(qrRef.current); // Use the append method from QRCodeStyling
    }
  }, [url]); // Re-run effect when URL changes

  return (
    <div className="p-4 bg-[#0C0C0E] border border-[#1C1C1E] rounded-xl shadow max-w-xs text-center flex flex-col items-center">
      <div ref={qrRef} className="rounded-xl" />
      <div className="text-[11px] mt-2 break-all text-gray-500">{url}</div>
    </div>
  );
}