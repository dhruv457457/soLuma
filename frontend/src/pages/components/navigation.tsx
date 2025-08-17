"use client"

import { useState } from "react"
import { BookOpen, Rocket, Ticket, Users, QrCode, Code, Menu, X } from "lucide-react"

const navigationItems = [
  { id: "introduction", label: "Introduction", icon: BookOpen },
  { id: "getting-started", label: "Getting Started", icon: Rocket },
  { id: "attendees", label: "For Attendees", icon: Ticket },
  { id: "organizers", label: "For Organizers", icon: Users },
  { id: "verification", label: "Ticket Verification", icon: QrCode },
]

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900/90 backdrop-blur-sm border border-gray-800/50 rounded-lg text-white"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <div
        className={`
        w-80 lg:w-1/5 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800/50 
        fixed h-full z-40 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-6 pt-14">
          <h1 className="text-xl font-bold text-white mb-8 mt-8 lg:mt-0">Documentation</h1>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
