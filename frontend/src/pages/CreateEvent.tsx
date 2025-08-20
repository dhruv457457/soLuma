// src/pages/CreateEvent.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
// 🚀 NEW: Import react-router-dom and react-query hooks
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// 🚀 NEW: Import Firebase functions and the createEvent API call
import { ensureFirebaseAuth, auth } from "../config/firebase";
import { createEvent } from "../lib/events";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
// 🚀 NEW: Import the Cloudinary upload utility
import { uploadImage } from "../lib/cloudinary";
import {
  Upload,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Wallet,
} from "lucide-react";

type Currency = "SOL" | "USDC";

// USDC Token Mint Address for Solana Devnet
const USDC_MINT_ADDRESS = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";

function toLamports(amount: number, currency: Currency) {
  // Correctly handle decimals for SOL (1e9) and USDC (1e6)
  const decimals = currency === "SOL" ? 9 : 6;
  return Math.round(amount * Math.pow(10, decimals));
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function CreateEventEnhanced() {
  const { accounts } = useSolanaWallet();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [currency, setCurrency] = useState<Currency>("SOL");
  const [price, setPrice] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("100");
  const [receiverWallet, setReceiverWallet] = useState<string>(
    accounts?.[0] || ""
  );
  const [err, setErr] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  // 🚀 NEW: State to hold the image file object
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["events", "published"] });
      navigate(`/e/${id}`);
    },
    onError: (e: any) => {
      setErr(e?.message || "Failed to create event. Please try again.");
    },
  });

  useEffect(() => {
    ensureFirebaseAuth();
  }, []);

  useEffect(() => {
    if (accounts?.[0]) {
      setReceiverWallet(accounts[0]);
    }
  }, [accounts]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 🚀 NEW: Set the file object in state
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!title || !startsAt || !price || !receiverWallet) {
      setErr("Please fill all required fields.");
      return;
    }

    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setErr("Price must be a positive number.");
      return;
    }

    const capNum = Math.max(1, Number(capacity) || 0);

    const uid = auth.currentUser?.uid;
    if (!uid) {
      setErr("Not signed in. Please refresh and try again.");
      return;
    }

    let bannerUrl = "";
    // 🚀 NEW: Upload the image to Cloudinary first if a file exists
    if (logoFile) {
      try {
        setErr(null); // Clear any previous errors
        createEventMutation.reset(); // Reset mutation state before starting
        
        // This line is crucial for starting the upload
        bannerUrl = await uploadImage(logoFile);
      } catch (error: any) {
        setErr(error.message || "Failed to upload image.");
        return;
      }
    }

    const newEvent = {
      title,
      slug: slugify(title),
      description,
      venue,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      currency,
      priceLamports: toLamports(priceNum, currency),
      receiverWallet: receiverWallet.trim(),
      capacity: capNum,
      salesCount: 0,
      status: "published",
      // 🔄 REVISED: Use the Cloudinary URL
      bannerUrl,
      createdBy: uid,
      // 🚀 NEW: Conditionally add the splToken field
      ...(currency === "USDC" ? { splToken: USDC_MINT_ADDRESS } : {}),
    };

    // 🔄 REVISED: Use the React Query mutation to submit the event data
    createEventMutation.mutate(newEvent);
  }

  // 🔄 REVISED: Use mutation state for submitting, including the upload phase
  const submitting = createEventMutation.isPending;

  return (
    <>
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Your Event
          </h1>
          <p className="text-gray-400 text-lg">
            Bring your community together on-chain.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Logo Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 h-fit sticky top-24">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                Event Logo
              </h3>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-700 hover:border-cyan-400 transition-colors duration-300 flex items-center justify-center bg-black overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">
                        Click to upload logo
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-800/50">
                <h4 className="text-sm font-medium text-purple-400 mb-2">
                  Pro Tips
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Use square images (1:1 ratio)</li>
                  <li>• Minimum 400x400 pixels</li>
                  <li>• Keep text readable at small sizes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
              {err && (
                <div className="bg-red-900/50 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  {err}
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                {/* Event Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Title*
                  </label>
                  <input
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Solana Summer Meetup"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Share the details of your event..."
                  />
                </div>

                {/* Date & Time Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      Starts At*
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      value={startsAt}
                      onChange={(e) => setStartsAt(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      Ends At
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                      value={endsAt}
                      onChange={(e) => setEndsAt(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    Venue
                  </label>
                  <input
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="123 Main St, City or Virtual Event Link"
                  />
                </div>

                {/* Pricing Row */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Currency*
                    </label>
                    <select
                      className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as Currency)}
                    >
                      <option value="SOL">SOL</option>
                      <option value="USDC">USDC</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      Price ({currency})*
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      min="0.000001"
                      className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={currency === "SOL" ? "0.25" : "25"}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      Capacity*
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                </div>

                {/* Receiver Wallet */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-purple-400" />
                    Receiver Wallet*
                  </label>
                  <input
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 font-mono text-sm"
                    value={receiverWallet}
                    onChange={(e) => setReceiverWallet(e.target.value)}
                    placeholder="Your Solana wallet address"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="relative inline-flex items-center justify-center w-full group ">
                  {/* This div creates the gradient border. It turns gray when submitting. */}
                  <div
                    className={`absolute transition-all duration-200 rounded-full -inset-px ${
                      submitting
                        ? "bg-gray-700"
                        : "bg-gradient-to-r from-cyan-500 to-purple-500"
                    }`}
                  ></div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`relative cursor-pointer inline-flex items-center justify-center w-full py-3 text-lg font-semibold rounded-full transition-all duration-300 ${
                      submitting
                        ? "bg-gray-900 text-gray-400 cursor-not-allowed"
                        : "text-white bg-black"
                    }`}
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        Creating Event...
                      </div>
                    ) : (
                      "Create Event"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}