import { Shield, Zap, Users, DollarSign, Lock, Globe } from "lucide-react";

export function WhyChooseSection() {
  const features = [
    {
      icon: Shield,
      title: "Decentralized & Secure",
      description:
        "Built on Solana blockchain for maximum security and transparency",
    },
    {
      icon: Zap,
      title: "Instant Payments",
      description: "Lightning-fast transactions with minimal fees",
    },
    {
      icon: Users,
      title: "Community Owned",
      description:
        "No middlemen, direct connection between creators and attendees",
    },
    {
      icon: DollarSign,
      title: "Multiple Currencies",
      description: "Accept payments in SOL, USDC, and other tokens",
    },
    {
      icon: Lock,
      title: "Full Transparency",
      description: "All transactions and event data on-chain and verifiable",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Accessible worldwide without traditional banking barriers",
    },
  ];

  return (
    <section className="relative py-20 px-6 bg-black overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        {/* The blue gradient div that caused the separation has been removed */}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Soluma?
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Experience the future of event management with blockchain-powered
            transparency and efficiency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-4 border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-300 transform group-hover:scale-110">
                <feature.icon className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}