"use client"

import { useEffect, useState } from "react"

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-section")
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  const stats = [
    {
      number: "1M+",
      label: "Tickets Minted On-Chain",
      delay: "delay-100",
    },
    {
      number: "5,000+",
      label: "Events Successfully Hosted",
      delay: "delay-200",
    },
    {
      number: "99.9%",
      label: "Uptime & Reliability",
      delay: "delay-300",
    },
  ]

  return (
    <section id="stats-section" className="relative py-24 px-4 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Proven by Numbers,
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Trusted by Creators
              </span>
            </h2>

            <p
              className={`text-gray-400 text-lg leading-relaxed max-w-md transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Soluma is engineered for reliability and scale. We provide the robust infrastructure needed for Web3 events, ensuring every ticket, payment, and interaction is secure and transparent on the Solana blockchain.
            </p>
          </div>

          {/* Right Stats Cards */}
          <div className="space-y-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 ${
                  isVisible ? `opacity-100 translate-x-0 ${stat.delay}` : "opacity-0 translate-x-8"
                }`}
              >
                <div className="flex flex-col space-y-2">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-lg font-medium transition-colors duration-300 group-hover:text-gray-300">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}