// src/pages/organizerDashboard/Sections/organizer-sidebar.tsx

"use client";

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, PlusCircle, Calendar, Ticket, Wallet,
  Settings, User, X, QrCode
} from "lucide-react";
import { cn } from "../../../utils/utils";
import logo from "/logo.png";

interface OrganizerSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isOrganizer: boolean;
}

const allSidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", organizerOnly: false },
  { id: "profile", label: "Profile", icon: User, to: "/dashboard/profile", organizerOnly: false },
  { id: "my-tickets", label: "My Tickets", icon: Ticket, to: "/dashboard/tickets", organizerOnly: false },
  { id: "explore", label: "Explore Events", icon: Calendar, to: "/dashboard/explore", organizerOnly: false },
  { id: "my-events", label: "My Events", icon: Calendar, to: "/dashboard/events", organizerOnly: true },
  { id: "create-event", label: "Create Event", icon: PlusCircle, to: "/dashboard/events/new", organizerOnly: false },
  { id: "scanner", label: "Scanner", icon: QrCode, to: "/dashboard/scanner", organizerOnly: true },
  { id: "revenue", label: "Revenue", icon: Wallet, to: "/dashboard/revenue", organizerOnly: true },
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

  const NavItem = ({ item, isMobile = false }: { item: typeof sidebarItems[0], isMobile?: boolean }) => (
    <NavLink
      to={item.to}
      end={item.to === "/dashboard"}
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
      {/* Desktop & Mobile Sidebars */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gray-900/50 backdrop-blur-sm border-r border-gray-800">
          <div className="flex items-center px-6 py-6 border-b border-gray-800"><BrandLogo /></div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => <NavItem key={item.id} item={item} />)}
          </nav>
        </div>
      </div>
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
          </nav>
        </div>
      </div>
    </>
  );
}