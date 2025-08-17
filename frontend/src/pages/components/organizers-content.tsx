import { Calendar, DollarSign, Users, BarChart3, Settings, Zap } from "lucide-react"

export default function OrganizersContent() {
  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">For Event Organizers</h1>
        <p className="text-lg text-gray-300">
          Create, manage, and monetize your events with powerful Web3 tools and analytics.
        </p>
      </div>

      {/* Event Creation Process */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex gap-3">
          <Calendar className="text-blue-400" size={24} />
          Event Creation Process
        </h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-2">Event Details Setup</h3>
              <p className="text-gray-300 text-sm mb-3">
                Configure your event information including name, description, date, venue, and capacity.
              </p>
              <div className="bg-black/30 border border-gray-700 rounded-lg p-4">
                <code className="text-green-400 text-sm">
                  const eventConfig = &#123;
                  <br />
                  &nbsp;&nbsp;name: "Web3 Conference 2024",
                  <br />
                  &nbsp;&nbsp;date: "2024-06-15T10:00:00Z",
                  <br />
                  &nbsp;&nbsp;venue: "Convention Center",
                  <br />
                  &nbsp;&nbsp;maxCapacity: 1000
                  <br />
                  &#125;
                </code>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-2">Ticket Configuration</h3>
              <p className="text-gray-300 text-sm mb-3">
                Set up multiple ticket tiers with different pricing, benefits, and availability periods.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/30 border border-gray-700 rounded-lg p-3">
                  <h4 className="text-white text-sm font-medium mb-2">General Admission</h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Price: 0.5 SOL</li>
                    <li>• Supply: 800 tickets</li>
                    <li>• Basic access</li>
                  </ul>
                </div>
                <div className="bg-black/30 border border-gray-700 rounded-lg p-3">
                  <h4 className="text-white text-sm font-medium mb-2">VIP Access</h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Price: 2.0 SOL</li>
                    <li>• Supply: 200 tickets</li>
                    <li>• Premium benefits</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-2">Smart Contract Deployment</h3>
              <p className="text-gray-300 text-sm">
                Deploy your event contract to the Solana blockchain with automated ticket minting and sales logic.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-2">Launch & Monitor</h3>
              <p className="text-gray-300 text-sm">
                Activate ticket sales and monitor performance through real-time analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue & Analytics */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex gap-3">
          <BarChart3 className="text-purple-400" size={24} />
          Revenue & Analytics
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <DollarSign className="text-green-400 mb-3" size={32} />
            <h3 className="text-white font-medium mb-2">Instant Payouts</h3>
            <p className="text-gray-300 text-sm">Receive payments instantly in your wallet as tickets are sold</p>
          </div>

          <div>
            <Users className="text-blue-400 mb-3" size={32} />
            <h3 className="text-white font-medium mb-2">Audience Insights</h3>
            <p className="text-gray-300 text-sm">Track attendee demographics and engagement metrics</p>
          </div>

          <div>
            <BarChart3 className="text-purple-400 mb-3" size={32} />
            <h3 className="text-white font-medium mb-2">Sales Analytics</h3>
            <p className="text-gray-300 text-sm">Monitor sales performance and optimize pricing strategies</p>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex gap-3">
          <Settings className="text-cyan-400" size={24} />
          Advanced Features
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Zap className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Dynamic Pricing</h3>
                <p className="text-gray-300 text-sm">Implement time-based or demand-based pricing algorithms</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="text-blue-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Whitelist Sales</h3>
                <p className="text-gray-300 text-sm">Create exclusive pre-sales for specific wallet addresses</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="text-green-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Royalty System</h3>
                <p className="text-gray-300 text-sm">Earn ongoing royalties from secondary market sales</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="text-purple-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Multi-Event Series</h3>
                <p className="text-gray-300 text-sm">Create season passes and recurring event subscriptions</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Settings className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">Custom Metadata</h3>
                <p className="text-gray-300 text-sm">Add custom attributes and unlockable content to tickets</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BarChart3 className="text-red-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="text-white font-medium">API Integration</h3>
                <p className="text-gray-300 text-sm">Integrate with existing event management and CRM systems</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}