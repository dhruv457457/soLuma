import { QrCode, Shield, Smartphone, CheckCircle } from "lucide-react"

export default function VerificationContent() {
  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Ticket Verification</h1>
        <p className="text-lg text-gray-300">
          Learn how Soluma's blockchain-based verification system ensures secure and instant ticket validation.
        </p>
      </div>

      {/* How Verification Works */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex gap-3">
          <Shield className="text-blue-400" size={24} />
          How Verification Works
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">QR Code Generation</h3>
                <p className="text-gray-300 text-sm">
                  Each NFT ticket generates a unique QR code containing the token's blockchain address and verification
                  metadata.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Blockchain Lookup</h3>
                <p className="text-gray-300 text-sm">
                  The verification app queries the Solana blockchain to confirm the ticket's authenticity and current
                  ownership status.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Instant Validation</h3>
                <p className="text-gray-300 text-sm">
                  Results appear instantly, showing ticket validity, event details, and any special access permissions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Entry Logging</h3>
                <p className="text-gray-300 text-sm">
                  Successful verifications are logged on-chain, preventing duplicate entries and providing attendance
                  records.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black/30 border border-gray-700 rounded-lg p-6">
            <h3 className="text-white font-medium mb-4">Verification Response</h3>
            <div className="bg-gray-900/50 rounded-lg p-4 text-sm">
              <code className="text-green-400">
                &#123;
                <br />
                &nbsp;&nbsp;"valid": true,
                <br />
                &nbsp;&nbsp;"tokenId": "7xKXtg2CW3UuUkoc...",
                <br />
                &nbsp;&nbsp;"eventName": "Web3 Conference",
                <br />
                &nbsp;&nbsp;"ticketType": "VIP Access",
                <br />
                &nbsp;&nbsp;"holderWallet": "9WzDXwBbmkg8ZTbN...",
                <br />
                &nbsp;&nbsp;"usedAt": null,
                <br />
                &nbsp;&nbsp;"specialAccess": ["backstage", "vip-lounge"]
                <br />
                &#125;
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Verification App Features */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex gap-3">
          <Smartphone className="text-purple-400" size={24} />
          Verification App Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <QrCode className="text-blue-400 mb-4" size={32} />
            <h3 className="text-white font-medium mb-2">QR Scanner</h3>
            <p className="text-gray-300 text-sm">Fast, accurate QR code scanning with camera integration</p>
          </div>

          <div>
            <Shield className="text-green-400 mb-4" size={32} />
            <h3 className="text-white font-medium mb-2">Offline Mode</h3>
            <p className="text-gray-300 text-sm">Cache verification data for events with poor connectivity</p>
          </div>

          <div>
            <CheckCircle className="text-purple-400 mb-4" size={32} />
            <h3 className="text-white font-medium mb-2">Batch Processing</h3>
            <p className="text-gray-300 text-sm">Verify multiple tickets simultaneously for faster entry</p>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Security & Anti-Fraud</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="text-blue-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Cryptographic Verification</h3>
                <p className="text-gray-300 text-sm">
                  Each ticket is cryptographically signed and cannot be forged or duplicated
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Real-time Validation</h3>
                <p className="text-gray-300 text-sm">
                  Instant blockchain queries ensure tickets haven't been used or transferred
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <QrCode className="text-purple-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Dynamic QR Codes</h3>
                <p className="text-gray-300 text-sm">
                  QR codes include timestamp and event-specific data to prevent replay attacks
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Smartphone className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Multi-Factor Verification</h3>
                <p className="text-gray-300 text-sm">Optional biometric or PIN verification for high-value events</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Audit Trail</h3>
                <p className="text-gray-300 text-sm">
                  Complete verification history stored immutably on the blockchain
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Fraud Detection</h3>
                <p className="text-gray-300 text-sm">
                  AI-powered anomaly detection identifies suspicious verification patterns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Implementation Guide</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Install Verification SDK</h3>
            <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
              <code className="text-green-400 text-sm">npm install @soluma/verification-sdk</code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-3">Basic Verification</h3>
            <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
              <code className="text-green-400 text-sm">
                import &#123; verifyTicket &#125; from '@soluma/verification-sdk'
                <br />
                <br />
                const result = await verifyTicket(&#123;
                <br />
                &nbsp;&nbsp;qrData: scannedQRCode,
                <br />
                &nbsp;&nbsp;eventId: 'your-event-id',
                <br />
                &nbsp;&nbsp;rpcEndpoint: 'https://api.mainnet-beta.solana.com'
                <br />
                &#125;)
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}