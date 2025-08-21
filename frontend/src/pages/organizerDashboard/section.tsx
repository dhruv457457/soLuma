// src/pages/organizerDashboard/section.tsx

"use client";

import { useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { useWeb3Auth, useWeb3AuthConnect } from "@web3auth/modal/react";
import { Menu } from "lucide-react";
import { OrganizerSidebar } from "./Sections/organizer-sidebar";
import { DashboardOverview } from "./Sections/dashboard-overview";
import { CreateEvent } from "./Sections/create-event";
import { MyEvents } from "./Sections/my-events";
import { TicketManagement } from "./Sections/ticket-management";
import { Analytics } from "./Sections/analytics";
import { AttendeeManagement } from "./Sections/attendee-management";
import { Revenue } from "./Sections/revenue";
import { Settings } from "./Sections/settings";
import { Profile } from "./Sections/profile";
import logo from "/logo.png";

export default function OrganizerDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get the Web3Auth instance and connection state
  const { accounts } = useSolanaWallet();
  const organizerWallet = accounts?.[0] || null;

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />; // Now calls hook internally
      case "create-event":
        return <CreateEvent />;
      case "my-events":
        return <MyEvents />;
      case "ticket-management":
        return <TicketManagement />;
      case "analytics":
        return <Analytics />;
      case "attendee-management":
        return <AttendeeManagement />;
      case "revenue":
        return <Revenue />;
      case "settings":
        return <Settings />;
      case "profile":
        return <Profile />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative flex">
        <OrganizerSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 lg:ml-64">
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800">
            <a href="/" className="inline-flex items-center cursor-pointer group">
              <img src={logo} alt="Soluma Logo" className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white group-hover:text-cyan-300 transition-colors duration-200">
                  Solu
                </span>
                <span className="text-cyan-400 group-hover:text-blue-400 transition-colors duration-200">
                  ma
                </span>
              </span>
            </a>

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <main className="p-4 lg:p-8">
            <div
              key={activeSection}
              className="animate-in fade-in slide-in-from-right-4 duration-500 ease-out"
            >
              {renderContent()}
            </div>
          </main>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </div>
    </div>
  );
}