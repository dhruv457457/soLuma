import React from "react";
import { QRCodeSVG } from "qrcode.react";

export default function PaymentQR({ url }: { url: string }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow max-w-xs text-center">
      <QRCodeSVG value={url} size={220} includeMargin />
      <div className="text-[11px] mt-2 break-all text-gray-500">{url}</div>
    </div>
  );
}
