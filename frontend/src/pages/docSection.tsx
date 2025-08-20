"use client"

import { useState } from "react"
import Navigation from "./components/navigation"
import IntroductionContent from "./components/introduction-content"
import GettingStartedContent from "./components/getting-started-content"
import AttendeesContent from "./components/attendees-content"
import OrganizersContent from "./components/organizers-content"
import VerificationContent from "./components/verification-content"
// ...existing code...


export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("introduction")

  return (
    <>
    <div className="min-h-screen bg-black text-white">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="flex min-h-screen relative">
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-[20%] p-4 md:p-8 overflow-y-auto">
          {activeSection === "introduction" && <IntroductionContent />}
          {activeSection === "getting-started" && <GettingStartedContent />}
          {activeSection === "attendees" && <AttendeesContent />}
          {activeSection === "organizers" && <OrganizersContent />}
          {activeSection === "verification" && <VerificationContent />}
        </div>
      </div>
    </div>
    </>
  )
}
