"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Badge } from "../../../ui/badge"
import { Input } from "../../../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"

export function TicketManagement() {
  const tickets = [
    {
      id: "TKT-001",
      eventName: "Web3 Conference 2024",
      ticketType: "General Admission",
      buyerName: "John Doe",
      buyerEmail: "john@example.com",
      purchaseDate: "Dec 10, 2024",
      price: "0.5 SOL",
      status: "Valid",
    },
    {
      id: "TKT-002",
      eventName: "Web3 Conference 2024",
      ticketType: "VIP",
      buyerName: "Jane Smith",
      buyerEmail: "jane@example.com",
      purchaseDate: "Dec 9, 2024",
      price: "1.0 SOL",
      status: "Valid",
    },
    {
      id: "TKT-003",
      eventName: "Blockchain Workshop",
      ticketType: "Standard",
      buyerName: "Mike Johnson",
      buyerEmail: "mike@example.com",
      purchaseDate: "Dec 8, 2024",
      price: "0.3 SOL",
      status: "Refunded",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Valid":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Used":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Refunded":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Transferred":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
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
            Ticket Management
          </h1>
          <p className="text-gray-400 mt-2">Monitor and manage all ticket transactions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
            Export Data
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              placeholder="Search tickets..."
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="web3-conf">Web3 Conference 2024</SelectItem>
                <SelectItem value="blockchain-workshop">Blockchain Workshop</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Ticket ID</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Event</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Buyer</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-4 px-4">
                      <span className="font-mono text-cyan-400">{ticket.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{ticket.eventName}</p>
                        <p className="text-sm text-gray-400">{ticket.purchaseDate}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white">{ticket.buyerName}</p>
                        <p className="text-sm text-gray-400">{ticket.buyerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {ticket.ticketType}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-green-400 font-medium">{ticket.price}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 hover:bg-gray-800 bg-transparent"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 hover:bg-gray-800 bg-transparent"
                        >
                          Refund
                        </Button>
                      </div>
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
