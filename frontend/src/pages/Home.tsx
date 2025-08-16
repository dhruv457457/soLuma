// src/pages/Home.tsx
import ComponentName from "../layout/HeroSection";
import { Footer } from "../layout/Footer";
import { WhyChooseSection } from "../layout/WhyChooseSection";
import { EventsShowcase } from "../layout/EventShowcase";
import StatsSection from "../layout/stats";
import WalletDemo from "./WalletDemo";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      <ComponentName />
      <WhyChooseSection />
      <EventsShowcase />
      <StatsSection />

      {/* Content Wrapper */}
      {/* <div className="relative z-10 p-4 sm:p-6 md:p-8">
        <WalletDemo />
      </div> */}

      <Footer />
    </div>
  );
}