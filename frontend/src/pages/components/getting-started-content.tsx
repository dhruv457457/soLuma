import { CheckCircle, AlertCircle } from "lucide-react"

export default function GettingStartedContent() {
  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Getting Started</h1>
        <p className="text-lg text-gray-300">
          Follow this comprehensive guide to set up your Soluma environment and create your first event.
        </p>
      </div>

      {/* Prerequisites */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex gap-3">
          <AlertCircle className="text-yellow-400" size={24} />
          Prerequisites
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-white font-medium">Solana Wallet</h3>
              <p className="text-gray-300">Install Phantom, Solflare, or any Solana-compatible wallet</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-white font-medium">SOL Tokens</h3>
              <p className="text-gray-300">Minimum 0.1 SOL for transaction fees and testing</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-white font-medium">Development Environment</h3>
              <p className="text-gray-300">Node.js 18+, npm/yarn, and a code editor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Steps */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Installation & Setup</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-3">1. Clone the Repository</h3>
            <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
              <code className="text-green-400 text-sm">
                git clone https://github.com/soluma/soluma-platform.git
                <br />
                cd soluma-platform
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-3">2. Install Dependencies</h3>
            <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
              <code className="text-green-400 text-sm">
                npm install
                <br /># or
                <br />
                yarn install
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-3">3. Environment Configuration</h3>
            <div className="bg-black/50 border border-gray-700 rounded-lg p-4 mb-3">
              <code className="text-green-400 text-sm">cp .env.example .env.local</code>
            </div>
            <p className="text-gray-300 text-sm">
              Configure your environment variables including RPC endpoints, wallet private keys, and API keys.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-3">4. Start Development Server</h3>
            <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
              <code className="text-green-400 text-sm">
                npm run dev
                <br /># or
                <br />
                yarn dev
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Quick Start Guide</h2>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-lg font-medium text-white mb-2">Step 1: Connect Your Wallet</h3>
            <p className="text-gray-300">
              Launch the application and connect your Solana wallet. Ensure you're on the correct network (mainnet-beta
              for production, devnet for testing).
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-lg font-medium text-white mb-2">Step 2: Create Your First Event</h3>
            <p className="text-gray-300">
              Navigate to the "Create Event" section, fill in event details, set ticket parameters, and deploy your
              event contract to the blockchain.
            </p>
          </div>

          <div className="border-l-4 border-cyan-500 pl-6">
            <h3 className="text-lg font-medium text-white mb-2">Step 3: Configure Ticket Sales</h3>
            <p className="text-gray-300">
              Set up pricing tiers, sale periods, maximum supply, and any special conditions for your tickets.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-medium text-white mb-2">Step 4: Launch & Monitor</h3>
            <p className="text-gray-300">
              Activate ticket sales, share your event link, and monitor sales through the dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Common Issues & Solutions</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-white font-medium mb-2">Wallet Connection Issues</h3>
            <p className="text-gray-300 text-sm">
              Ensure your wallet is unlocked, on the correct network, and has sufficient SOL for transactions.
            </p>
          </div>

          <div>
            <h3 className="text-white font-medium mb-2">Transaction Failures</h3>
            <p className="text-gray-300 text-sm">
              Check network congestion, increase priority fees, or try again after a few minutes.
            </p>
          </div>

          <div>
            <h3 className="text-white font-medium mb-2">Development Environment</h3>
            <p className="text-gray-300 text-sm">
              Ensure Node.js version compatibility and clear npm cache if installation fails.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}