import { Shield, Zap, Globe, Users } from "lucide-react"

export default function IntroductionContent() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
          Welcome to Soluma
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
          The next-generation Web3 event ticketing platform that revolutionizes how events are organized, tickets are
          distributed, and attendees engage with experiences.
        </p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8">
        <h2 className="text-3xl font-semibold text-white mb-6">What is Soluma?</h2>
        <div className="space-y-4 text-gray-300 leading-relaxed prose prose-invert max-w-none prose-p:text-gray-300">
          <p>
            Soluma is a comprehensive Web3 ticketing ecosystem built on the Solana blockchain that addresses the
            fundamental challenges of traditional event ticketing. By leveraging blockchain technology, we eliminate
            fraud, reduce costs, and create new opportunities for event organizers and attendees.
          </p>
          <p>
            Our platform transforms event tickets into secure, verifiable digital assets (NFTs) that cannot be
            counterfeited, duplicated, or fraudulently resold. This creates a transparent, trustless environment where
            every ticket transaction is recorded on the blockchain.
          </p>
          <p>
            Beyond basic ticketing, Soluma enables dynamic pricing, automated royalties for organizers, exclusive holder
            benefits, and seamless integration with the broader Web3 ecosystem.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { icon: Shield, title: "Fraud Prevention", text: "Blockchain-based tickets eliminate counterfeiting and unauthorized duplication. Every ticket is cryptographically secured and verifiable in real-time.", color: "text-blue-400" },
          { icon: Zap, title: "Instant Verification", text: "QR code scanning instantly verifies ticket authenticity against the blockchain, eliminating long queues and manual verification processes.", color: "text-purple-400" },
          { icon: Globe, title: "Global Accessibility", text: "Solana's fast, low-cost transactions enable global ticket sales without traditional payment processing limitations or high fees.", color: "text-cyan-400" },
          { icon: Users, title: "Community Building", text: "NFT tickets become collectibles and community membership tokens, creating lasting connections between organizers and attendees.", color: "text-green-400" },
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="group p-6 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-300 transform group-hover:scale-110">
                  <Icon size={24} className={`${feature.color} group-hover:text-purple-300 transition-colors duration-300`} />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {feature.text}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}