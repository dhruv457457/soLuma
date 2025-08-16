// src/components/NavBar.tsx
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
} from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { DollarSign, User } from "lucide-react";
import logo from "/logo.png";

type NavItem = {
  label: string;
  to: string;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { label: "Create Event", to: "/org/events" },
  { label: "Docs", to: "/docs" },
  { label: "Explore Events", to: "/events" },
  { label: "Scanner", to: "/scan" },
  { label: "My Tickets", to: "/tickets" },
];

function navClasses(isActive: boolean) {
  return [
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105",
    isActive
      ? "bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/25"
      : "text-gray-300 hover:text-white hover:bg-white/5 hover:shadow-lg hover:shadow-white/10",
  ].join(" ");
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  // 🚀 NEW: Add an initial loading state
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const profilePanelRef = useRef<HTMLDivElement | null>(null);
  const profileBtnRef = useRef<HTMLButtonElement | null>(null);

  // Web3Auth hooks
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

  // 🔄 REVISED: Handle initial loading state
  useEffect(() => {
    // We only want to run this once on mount
    const handleConnect = async () => {
      try {
        await connect();
      } catch (e) {
        console.error("Auto-connect failed:", e);
      } finally {
        // This ensures loading is false after the attempt
        setIsInitialLoading(false);
      }
    };

    if (!isConnected) {
      handleConnect();
    } else {
      setIsInitialLoading(false);
    }
  }, [connect, isConnected]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // close menu on route change
  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const t = e.target as Node;

      // Close mobile menu
      if (open && panelRef.current && btnRef.current) {
        if (!panelRef.current.contains(t) && !btnRef.current.contains(t)) {
          setOpen(false);
        }
      }

      // Close profile dropdown
      if (profileOpen && profilePanelRef.current && profileBtnRef.current) {
        if (
          !profilePanelRef.current.contains(t) &&
          !profileBtnRef.current.contains(t)
        ) {
          setProfileOpen(false);
        }
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, profileOpen]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
  };

  const WalletSection = () => {
    // 🚀 NEW: Check for the new initial loading state first
    if (isInitialLoading) {
      return (
        <div className="relative inline-flex items-center justify-center group">
          <button
            className="cursor-not-allowed relative inline-flex items-center justify-center px-7 py-2 text-base font-normal text-white bg-black border border-transparent rounded-full opacity-50"
            disabled={true}
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Connecting...
            </div>
          </button>
        </div>
      );
    }

    // Now, proceed with the original logic only after the initial check is complete
    if (!isConnected) {
      return (
        <div className="relative inline-flex items-center justify-center group">
          <div className=" absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500"></div>
          <button
            className="cursor-pointer relative inline-flex items-center justify-center px-7 py-2 text-base font-normal text-white bg-black border border-transparent rounded-full"
            onClick={connect}
          >
            Connect Wallet
          </button>
        </div>
      );
    }

    return (
      <div className="relative">
        <button
          ref={profileBtnRef}
          onClick={(e) => {
            e.stopPropagation();
            setProfileOpen(!profileOpen);
          }}
          className="relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 hover:border-transparent transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
        >
          <User className="w-5 h-5 text-gray-300 hover:text-white transition-colors duration-200" />
        </button>

        {/* Profile Dropdown */}
        <div
          className={`absolute right-0 top-full mt-2 w-72 transition-all duration-300 ease-out transform ${
            profileOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
          }`}
        >
          <div
            ref={profilePanelRef}
            className="bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-3 z-[60] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Wallet Info Section */}
            {addressAvailable && (
              <div className="px-4 py-4 border-b border-gray-700/50">
                <div className="flex items-start gap-3">
                  <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12A2,2 0 0,0 10,8V16A2,2 0 0,0 12,18H21Z" />
                    </svg>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-sm">
                          {accounts[0].slice(0, 6)}...{accounts[0].slice(-4)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-green-400 text-xs font-medium">
                            Connected
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(accounts[0])}
                        className="group p-2 text-gray-400 hover:text-white hover:bg-gray-800/70 rounded-lg transition-all duration-200 transform hover:scale-110"
                        title="Copy address"
                      >
                        <svg
                          className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Options */}
            <div className="py-2">
              <Link
                to="/profile"
                className="group flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800/70 transition-all duration-200 transform hover:translate-x-1"
                onClick={() => setProfileOpen(false)}
              >
                <div className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <span className="text-sm font-medium group-hover:text-blue-100 transition-colors duration-200">
                  Your Profile
                </span>
              </Link>

              <Link
                to="/settings"
                className="group flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800/70 transition-all duration-200 transform hover:translate-x-1"
                onClick={() => setProfileOpen(false)}
              >
                <div className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors duration-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium group-hover:text-green-100 transition-colors duration-200">
                  Settings
                </span>
              </Link>
            </div>

            {/* Logout Section */}
            <div className="border-t border-gray-700/50 pt-2">
              <button
                onClick={() => {
                  disconnect({ cleanup: true });
                  setProfileOpen(false);
                }}
                disabled={disconnectLoading}
                className="group w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50 transform hover:translate-x-1"
              >
                <div className="w-5 h-5 group-hover:text-red-300 transition-colors duration-200">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium group-hover:text-red-300 transition-colors duration-200">
                  {disconnectLoading ? "Signing out..." : "Sign out"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Toast Notification */}
      <div
        className={`fixed top-4 right-4 z-[100] transition-all duration-500 ease-out transform ${
          showToast
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl backdrop-blur-sm flex items-center gap-3">
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="font-medium text-sm">
            Address copied to clipboard!
          </span>
        </div>
      </div>

      <nav
        className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/5 transition-all duration-300"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.97) 50%, rgba(0,0,0,0.98) 100%)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          borderImage:
            "linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0.3)) 1",
          boxShadow:
            "0 8px 32px 0 rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.02)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Bar */}
          <div className="flex h-16 items-center justify-between">
            {/* Brand - Left */}
            <div className="flex items-center">
              <Link
                to="/"
                className="inline-flex items-center cursor-pointer group"
              >
                {/* Logo */}
                <img src={logo} alt="Soluma Logo" className="h-12 w-12" />

                {/* Text */}
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-white group-hover:text-blue-300 transition-colors duration-200">
                    SoLu
                  </span>
                  <span className="text-blue-400 group-hover:text-purple-400 transition-colors duration-200">
                    ma
                  </span>
                </span>
              </Link>
            </div>

            {/* Time and Navigation - Right */}
            <div className="hidden md:flex md:items-center md:gap-8">
              {/* Time Display */}
              <div className="text-gray-400 text-sm font-mono bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800">
                {formatTime(currentTime)}
              </div>

              {/* Navigation Links */}
              <div className="flex items-center gap-2">
                {navItems.map(({ label, to }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => navClasses(isActive)}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>

              {/* Wallet Section */}
              <WalletSection />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                ref={btnRef}
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                {open ? (
                  // X icon
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  // Hamburger
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile panel */}
            <div
              ref={panelRef}
              className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
                open ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="border-t border-gray-800/50 py-4 space-y-3">
                {/* Mobile Time Display */}
                <div className="px-3">
                  <div className="text-gray-400 text-sm font-mono bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-800 text-center">
                    {formatTime(currentTime)}
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-1 px-3">
                  {navItems.map(({ label, to }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        [
                          "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                          isActive
                            ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                            : "text-gray-300 hover:text-white hover:bg-gray-800/50",
                        ].join(" ")
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>

                {/* Mobile Wallet Section */}
                <div className="border-t border-gray-800/50 pt-4 mt-4 px-3">
                  {!isConnected ? (
                    <button
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                      disabled={connectLoading}
                      onClick={connect}
                    >
                      {connectLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Connecting...
                        </div>
                      ) : (
                        "Connect Wallet"
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* Mobile Wallet Info Card */}
                      {addressAvailable && (
                        <div className="bg-gray-900/80 rounded-lg p-4 border border-gray-800">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-4 h-4 text-white"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12A2,2 0 0,0 10,8V16A2,2 0 0,0 12,18H21Z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-white font-medium text-sm">
                                    {accounts[0].slice(0, 6)}...
                                    {accounts[0].slice(-4)}
                                  </h3>
                                  <span className="text-green-400 text-xs font-medium">
                                    Connected
                                  </span>
                                </div>
                                <button
                                  onClick={() => copyToClipboard(accounts[0])}
                                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                  title="Copy address"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mobile Menu Options */}
                      <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors border-b border-gray-800"
                          onClick={() => setOpen(false)}
                        >
                          <svg
                            className="w-5 h-5 text-gray-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                          <span className="font-medium">Dashboard</span>
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors border-b border-gray-800"
                          onClick={() => setOpen(false)}
                        >
                          <svg
                            className="w-5 h-5 text-gray-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="font-medium">Settings</span>
                        </Link>

                        <button
                          onClick={() => {
                            disconnect({ cleanup: true });
                            setOpen(false);
                          }}
                          disabled={disconnectLoading}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors disabled:opacity-50"
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-medium">
                            {disconnectLoading ? "Signing out..." : "Sign out"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                  {(connectError || disconnectError) && (
                    <div className="mt-3 text-xs text-red-400 text-center bg-red-900/20 border border-red-800 rounded-lg py-2 px-3">
                      {connectError?.message || disconnectError?.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}