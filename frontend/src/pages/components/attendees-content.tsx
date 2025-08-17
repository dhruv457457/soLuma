import { Ticket, Smartphone, Shield, Gift } from "lucide-react"

export default function AttendeesContent() {
  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">For Attendees</h1>
        <p className="text-lg text-gray-300">
          Discover how Soluma enhances your event experience with secure, digital tickets and exclusive benefits.
        </p>
      </div>

      {/* How to Purchase */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex gap-3">
          <Ticket className="text-blue-400" size={24} />
          How to Purchase Tickets
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                1
              </div>
              <div>
                <h3 className="text-white font-medium">Connect Your Wallet</h3>
                <p className="text-gray-300 text-sm">
                  Connect your Solana wallet (Phantom, Solflare, etc.) to the platform
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                2
              </div>
              <div>
                <h3 className="text-white font-medium">Browse Events</h3>
                <p className="text-gray-300 text-sm">Explore available events and select your preferred tickets</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                3
              </div>
              <div>
                <h3 className="text-white font-medium">Complete Purchase</h3>
                <p className="text-gray-300 text-sm">Pay with SOL, USDC, or other supported tokens</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                4
              </div>
              <div>
                <h3 className="text-white font-medium">Receive NFT Ticket</h3>
                <p className="text-gray-300 text-sm">Your ticket NFT appears instantly in your wallet</p>
              </div>
            </div>
          </div>

          <div className="bg-black/30 border border-gray-700 rounded-lg p-6">
            <h4 className="text-white font-medium mb-3">Supported Payment Methods</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• SOL (Solana native token)</li>
              <li>• USDC (USD Coin)</li>
              <li>• USDT (Tether)</li>
              <li>• Other SPL tokens</li>
              <li>• Credit/Debit cards (via fiat gateway)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Experience */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex gap-3">
          <Smartphone className="text-purple-400" size={24} />
          Mobile Experience
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Smartphone className="text-purple-400" size={24} />
            </div>
            <h3 className="text-white font-medium mb-2">Mobile Wallet</h3>
            <p className="text-gray-300 text-sm">Access your tickets directly from your mobile Solana wallet app</p>
          </div>

          <div>
            <div className="bg-cyan-600/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Shield className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-white font-medium mb-2">QR Code Entry</h3>
            <p className="text-gray-300 text-sm">Show your QR code at the venue for instant verification and entry</p>
          </div>

          <div>
            <div className="bg-green-600/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Gift className="text-green-400" size={24} />
            </div>
            <h3 className="text-white font-medium mb-2">Exclusive Benefits</h3>
            <p className="text-gray-300 text-sm">Unlock special perks and collectibles with your NFT tickets</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Why Choose Soluma Tickets?</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="text-blue-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Fraud Protection</h3>
                <p className="text-gray-300 text-sm">
                  Blockchain verification eliminates fake tickets and unauthorized resales
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Gift className="text-purple-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Collectible Value</h3>
                <p className="text-gray-300 text-sm">
                  Your tickets become permanent collectibles and proof of attendance
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Smartphone className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Easy Access</h3>
                <p className="text-gray-300 text-sm">No need for physical tickets or email confirmations</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Ticket className="text-green-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Instant Transfer</h3>
                <p className="text-gray-300 text-sm">Safely transfer tickets to friends without intermediaries</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Refund Protection</h3>
                <p className="text-gray-300 text-sm">Smart contracts ensure automatic refunds for cancelled events</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Gift className="text-red-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Exclusive Access</h3>
                <p className="text-gray-300 text-sm">Unlock special content, merchandise, and future event discounts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}