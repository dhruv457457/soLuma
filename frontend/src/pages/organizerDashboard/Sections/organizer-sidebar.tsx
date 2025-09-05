"use client";

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, PlusCircle, Calendar, Ticket,
  Settings, User, X, QrCode, LogOut,
  ImagePlusIcon
} from "lucide-react";
import { cn } from "../../../utils/utils";
import { useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react"; // 👈 1. Import useWeb3AuthUser
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import logo from "/logo.png";

interface OrganizerSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isOrganizer: boolean;
}

const allSidebarItems = [
    // { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", organizerOnly: false },
    { id: "profile", label: "Profile", icon: User, to: "/dashboard/profile", organizerOnly: false },
    { id: "my-tickets", label: "My Tickets", icon: Ticket, to: "/dashboard/tickets", organizerOnly: false },
    { id: "explore", label: "Explore Events", icon: Calendar, to: "/dashboard/explore", organizerOnly: false },
    { id: "my-events", label: "My Events", icon: ImagePlusIcon, to: "/dashboard/events", organizerOnly: true },
    { id: "create-event", label: "Create Event", icon: PlusCircle, to: "/dashboard/events/new", organizerOnly: false },
    { id: "scanner", label: "Scanner", icon: QrCode, to: "/dashboard/scanner", organizerOnly: true },
    { id: "settings", label: "Settings", icon: Settings, to: "/dashboard/settings", organizerOnly: true },
];

const BrandLogo = ({ className = "" }: { className?: string }) => (
  <a href="/" className={`inline-flex items-center cursor-pointer group ${className}`}>
    <img src={logo} alt="Soluma Logo" className="h-9 w-9 mr-2" />
    <span className="text-2xl font-bold tracking-tight">
      <span className="text-white group-hover:text-cyan-300">Solu</span>
      <span className="text-cyan-400 group-hover:text-blue-400">ma</span>
    </span>
  </a>
);

export function OrganizerSidebar({ sidebarOpen, setSidebarOpen, isOrganizer }: OrganizerSidebarProps) {
  const sidebarItems = allSidebarItems.filter(item => !item.organizerOnly || isOrganizer);

  // --- Start of Integration ---
  // 2. Use the hook to get userInfo and connection status
  const { userInfo } = useWeb3AuthUser();
  const { accounts } = useSolanaWallet();
  const { disconnect, loading: isDisconnecting } = useWeb3AuthDisconnect();
  const isConnected = accounts && accounts.length > 0;

  // 3. The old useState and useEffect for userInfo are no longer needed and have been removed.

  const wallet = accounts?.[0] || "";
  const formatWalletAddress = (address: string) => {
    if (!address) return "Not connected";
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };
  
  const handleDisconnect = async () => {
    try {
      await disconnect({ cleanup: true });
      window.location.href = "/";
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  const NavItem = ({ item, isMobile = false }: { item: typeof sidebarItems[0], isMobile?: boolean }) => (
    <NavLink
      to={item.to}
      end={item.to === "/dashboard" || item.id === "my-events"}
      onClick={() => isMobile && setSidebarOpen(false)}
      className={({ isActive }) => cn(
        "w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 ease-in-out relative overflow-hidden",
        "border border-transparent cursor-pointer",
        isActive
          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30 shadow-lg shadow-cyan-500/10"
          : "text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-700/50"
      )}
    >
      {({ isActive }) => (
        <>
          <item.icon className={cn(
            "mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300",
            isActive ? "text-cyan-400" : "text-gray-400"
          )} />
          <span className="font-medium">{item.label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gray-900/50 backdrop-blur-sm border-r border-gray-800">
          <div className="flex items-center px-6 py-6 border-b border-gray-800"><BrandLogo /></div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => <NavItem key={item.id} item={item} />)}
            {isConnected && (
              <button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 ease-in-out relative overflow-hidden border border-transparent cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300 text-red-400" />
                <span className="font-medium">
                  {isDisconnecting ? "Disconnecting..." : "Disconnect Wallet"}
                </span>
              </button>
            )}
          </nav>
          {/* 👇 4. Update the User Profile Section */}
          <div className="mt-auto px-6 py-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              {userInfo?.profileImage ? (
                <img 
                  className="w-10 h-10 rounded-full object-cover" 
                  src={userInfo.profileImage} 
                  referrerPolicy="no-referrer" 
                  alt="Profile" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {/* Fallback to first letter of name, or 'U' for User */}
                  {(userInfo?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-white text-sm leading-tight truncate">{userInfo?.name || "User"}</span>
                <span className="text-gray-400 text-xs leading-tight truncate">{userInfo?.email || "No email"}</span>
                <span className="text-cyan-400 text-xs leading-tight font-mono">{formatWalletAddress(wallet)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div className={cn("fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:hidden", sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
            <BrandLogo />
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors ml-4">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => <NavItem key={item.id} item={item} isMobile />)}
            {isConnected && (
              <button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 ease-in-out relative overflow-hidden border border-transparent cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300 text-red-400" />
                <span className="font-medium">
                  {isDisconnecting ? "Disconnecting..." : "Disconnect Wallet"}
                </span>
              </button>
            )}
          </nav>
           {/* 👇 4. Update the User Profile Section for Mobile */}
          <div className="mt-auto px-6 py-4 border-t border-gray-800">
             <div className="flex items-center gap-3">
              {userInfo?.profileImage ? (
                <img 
                  className="w-10 h-10 rounded-full object-cover" 
                  src={userInfo.profileImage} 
                  referrerPolicy="no-referrer" 
                  alt="Profile" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {(userInfo?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-white text-sm leading-tight truncate">{userInfo?.name || "User"}</span>
                <span className="text-gray-400 text-xs leading-tight truncate">{userInfo?.email || "No email"}</span>
                <span className="text-cyan-400 text-xs leading-tight font-mono">{formatWalletAddress(wallet)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}