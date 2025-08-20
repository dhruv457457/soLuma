"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Badge } from "../../../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Progress } from "../../../ui/progress"

export function Revenue() {
  const revenueMetrics = [
    { title: "Total Revenue", value: "$45,230", change: "+18%", trend: "up" },
    { title: "This Month", value: "$12,450", change: "+25%", trend: "up" },
    { title: "Pending Payouts", value: "$3,200", change: "-$800", trend: "down" },
    { title: "Platform Fees", value: "$2,261", change: "+$340", trend: "up" },
  ]

  const revenueByEvent = [
    { name: "Web3 Conference 2024", revenue: "$12,250", tickets: 245, avgPrice: "$50", status: "Paid" },
    { name: "Blockchain Workshop", revenue: "$4,450", tickets: 89, avgPrice: "$50", status: "Paid" },
    { name: "NFT Art Exhibition", revenue: "$7,800", tickets: 156, avgPrice: "$50", status: "Pending" },
    { name: "DeFi Summit", revenue: "$3,900", tickets: 78, avgPrice: "$50", status: "Pending" },
  ]

  const payoutHistory = [
    { date: "Dec 1, 2024", amount: "$8,750", method: "Bank Transfer", status: "Completed", txId: "TXN-001" },
    { date: "Nov 15, 2024", amount: "$6,200", method: "Crypto Wallet", status: "Completed", txId: "TXN-002" },
    { date: "Nov 1, 2024", amount: "$4,800", method: "Bank Transfer", status: "Completed", txId: "TXN-003" },
    { date: "Oct 15, 2024", amount: "$3,400", method: "Crypto Wallet", status: "Completed", txId: "TXN-004" },
  ]

  const paymentMethods = [
    { method: "Solana (SOL)", transactions: 156, percentage: 45, revenue: "$20,385" },
    { method: "USDC", transactions: 89, percentage: 30, revenue: "$13,569" },
    { method: "Credit Card", transactions: 67, percentage: 20, revenue: "$9,046" },
    { method: "Other Crypto", transactions: 23, percentage: 5, revenue: "$2,230" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Revenue Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Track your earnings and manage payouts.</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            Request Payout
          </Button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueMetrics.map((metric, index) => (
          <Card key={index} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
              <div className="text-center">
                <p className="text-gray-400 mb-2">Area Chart Component</p>
                <p className="text-sm text-gray-500">Revenue over time visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{method.method}</span>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">{method.revenue}</p>
                    <p className="text-sm text-gray-400">{method.transactions} transactions</p>
                  </div>
                </div>
                <Progress value={method.percentage} className="h-2 bg-gray-700" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Event */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Revenue by Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Event Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Revenue</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Tickets Sold</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Avg Price</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {revenueByEvent.map((event, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-4 px-4">
                      <span className="text-white font-medium">{event.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-green-400 font-bold">{event.revenue}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">{event.tickets}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">{event.avgPrice}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Method</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.map((payout, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-4 px-4">
                      <span className="text-white">{payout.date}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-green-400 font-bold">{payout.amount}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">{payout.method}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-cyan-400">{payout.txId}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(payout.status)}>{payout.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
