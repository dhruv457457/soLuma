export type Currency = "SOL" | "USDC";

export interface EventDoc {
  id: string;
  title: string;
  slug: string;
  bannerUrl?: string;
  description?: string;
  startsAt: string;
  endsAt?: string;
  venue?: string;
  currency: Currency;
  priceLamports: number;
  receiverWallet: string;
  capacity: number;
  salesCount: number;
  createdBy: string;
  status: "draft" | "published" | "ended";
  splToken?: string;  // Add this line
}
export interface OrderDoc {
  id: string;
  eventId: string;
  buyerWallet: string | null;
  buyerName?: string;  // Added optional buyer name field
  qty: number;
  amountLamports: number;
  currency: Currency;
  receiverWallet: string;
  reference: string;
  status: "pending" | "paid" | "failed";
  checkInStatus?: "checked-in" | "not-checked-in" | "no-show";
  txSig?: string;
  checkInTime?: number;
  createdAt: number;
}
export interface TicketDoc {
  id: string;
  eventId: string;
  orderId: string;
  ownerWallet: string | null;
  status: "issued" | "redeemed";
  qrTokenHash: string;
  redeemedAt?: any;
}
