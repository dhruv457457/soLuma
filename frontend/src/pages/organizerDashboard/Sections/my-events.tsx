"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Badge } from "../../../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu"

export function MyEvents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const events = [
    {
      id: 1,
      name: "Web3 Conference 2024",
      date: "Dec 15, 2024",
      time: "10:00 AM",
      location: "San Francisco, CA",
      status: "Active",
      ticketsSold: 245,
      totalTickets: 300,
      revenue: "$12,250",
      category: "Conference",
    },
    {
      id: 2,
      name: "Blockchain Workshop",
      date: "Dec 20, 2024",
      time: "2:00 PM",
      location: "Online",
      status: "Active",
      ticketsSold: 89,
      totalTickets: 150,
      revenue: "$4,450",
      category: "Workshop",
    },
    {
      id: 3,
      name: "NFT Art Exhibition",
      date: "Dec 25, 2024",
      time: "6:00 PM",
      location: "New York, NY",
      status: "Draft",
      ticketsSold: 0,
      totalTickets: 200,
      revenue: "$0",
      category: "Exhibition",
    },
    {
      id: 4,
      name: "DeFi Summit",
      date: "Jan 5, 2025",
      time: "9:00 AM",
      location: "Miami, FL",
      status: "Draft",
      ticketsSold: 0,
      totalTickets: 500,
      revenue: "$0",
      category: "Conference",
    },
    {
      id: 5,
      name: "Crypto Networking Night",
      date: "Nov 30, 2024",
      time: "7:00 PM",
      location: "Austin, TX",
      status: "Completed",
      ticketsSold: 120,
      totalTickets: 120,
      revenue: "$6,000",
      category: "Networking",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || event.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            My Events
          </h1>
          <p className="text-gray-400 mt-2">Manage and track all your events in one place.</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
          Create New Event
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-cyan-500/30 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-white mb-2">{event.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      {event.category}
                    </Badge>
                    <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem className="text-white hover:bg-gray-700">Edit Event</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700">View Analytics</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700">Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-400">
                  <span className="mr-2">📅</span>
                  {event.date} at {event.time}
                </div>
                <div className="flex items-center text-gray-400">
                  <span className="mr-2">📍</span>
                  {event.location}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tickets Sold</span>
                  <span className="text-white">
                    {event.ticketsSold}/{event.totalTickets}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                <span className="text-sm text-gray-400">Revenue</span>
                <span className="font-semibold text-green-400">{event.revenue}</span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 border-gray-700 hover:bg-gray-800 bg-transparent">
                  Edit
                </Button>
                <Button size="sm" className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Create your first event to get started."}
            </p>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              Create New Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
