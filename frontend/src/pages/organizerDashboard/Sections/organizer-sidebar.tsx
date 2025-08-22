"use client"

import {
  LayoutDashboard,
  PlusCircle,
  Calendar,
  Ticket,
  BarChart2,
  Users,
  Wallet,
  Settings,
  User,
  X,
  QrCode,
} from "lucide-react"
import { cn } from "../../../utils/utils"
import logo from "/logo.png"

interface OrganizerSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const sidebarItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "my-tickets", label: "My Tickets", icon: Ticket },
  { id: "events-list", label: "Explore Events", icon: Calendar },
  { id: "create-event", label: "Create Event", icon: PlusCircle },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "my-events", label: "My Events", icon: Calendar },
 
  { id: "revenue", label: "Revenue", icon: Wallet },
  { id: "settings", label: "Settings", icon: Settings },
]

// Reusable Brand Component to ensure consistency
const BrandLogo = ({ className = "" }: { className?: string }) => (
  <a href="/" className={`inline-flex items-center cursor-pointer group ${className}`}>
    <img src={logo} alt="Soluma Logo" className="h-9 w-9 mr-2" />
    <span className="text-2xl font-bold tracking-tight">
      <span className="text-white group-hover:text-cyan-300 transition-colors duration-200">
        Solu
      </span>
      <span className="text-cyan-400 group-hover:text-blue-400 transition-colors duration-200">
        ma
      </span>
    </span>
  </a>
)

export function OrganizerSidebar({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
}: OrganizerSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gray-900/50 backdrop-blur-sm border-r border-gray-800">
          {/* Header */}
          <div className="flex items-center px-6 py-6 border-b border-gray-800">
            <BrandLogo />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 ease-in-out relative overflow-hidden",
                  "border border-transparent cursor-pointer",
                  activeSection === item.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-700/50",
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300",
                  activeSection === item.id ? "text-cyan-400" : "text-gray-400"
                )} />
                <span className="font-medium transition-all duration-300">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header - Same as desktop */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
            <BrandLogo />
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
                className={cn(
                  "w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 ease-in-out relative overflow-hidden",
                  "border border-transparent",
                  activeSection === item.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-700/50",
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300",
                  activeSection === item.id ? "text-cyan-400" : "text-gray-400"
                )} />
                <span className="font-medium transition-all duration-300">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}