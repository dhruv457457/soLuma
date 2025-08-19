import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FaCopy } from "react-icons/fa";

const truncateURL = (url: string): string => url.length < 36 ? url : url.slice(0, 16) + "..." + url.slice(-16);

interface PaymentQRProps {
  url: string;
}

export default function PaymentQR({ url }: PaymentQRProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="flex flex-col items-center">
      <QRCodeSVG value={url} size={180} bgColor="#0c0c0e" fgColor="#fff" />
      <div className="flex flex-col items-center mt-3">
        <span className="text-xs text-gray-400 font-semibold mb-1">Scan to Pay</span>
        <div className="flex items-center justify-center text-[11px] text-gray-500 font-mono bg-gray-800 rounded px-2 py-1">
          <span title={url}>{truncateURL(url)}</span>
          <button onClick={handleCopy} className="ml-1 text-cyan-400 hover:text-cyan-300" title="Copy URL">
            <FaCopy size={12} />
          </button>
        </div>
        {copied && <div className="mt-1 text-emerald-400 text-xs">Copied!</div>}
      </div>
    </div>
  );
}
