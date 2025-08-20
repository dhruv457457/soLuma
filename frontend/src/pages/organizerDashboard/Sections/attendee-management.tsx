"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Badge } from "../../../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Checkbox } from "../../../ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"

export function AttendeeManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [eventFilter, setEventFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([])

  const attendees = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      event: "Web3 Conference 2024",
      ticketType: "VIP",
      purchaseDate: "Dec 10, 2024",
      checkInStatus: "Checked In",
      checkInTime: "9:30 AM",
      walletAddress: "7xKX...9mNp",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      event: "Web3 Conference 2024",
      ticketType: "General",
      purchaseDate: "Dec 9, 2024",
      checkInStatus: "Not Checked In",
      checkInTime: null,
      walletAddress: "4bYz...2kLm",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      event: "Blockchain Workshop",
      ticketType: "Standard",
      purchaseDate: "Dec 8, 2024",
      checkInStatus: "Checked In",
      checkInTime: "2:15 PM",
      walletAddress: "9pQr...5vWx",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      event: "Web3 Conference 2024",
      ticketType: "General",
      purchaseDate: "Dec 7, 2024",
      checkInStatus: "No Show",
      checkInTime: null,
      walletAddress: "3nTy...8hGf",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      event: "NFT Art Exhibition",
      ticketType: "Premium",
      purchaseDate: "Dec 6, 2024",
      checkInStatus: "Checked In",
      checkInTime: "6:45 PM",
      walletAddress: "6mUi...1cVb",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Checked In":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Not Checked In":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "No Show":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTicketTypeColor = (type: string) => {
    switch (type) {
      case "VIP":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Premium":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEvent = eventFilter === "all" || attendee.event === eventFilter
    const matchesStatus =
      statusFilter === "all" || attendee.checkInStatus.toLowerCase().replace(" ", "-") === statusFilter
    return matchesSearch && matchesEvent && matchesStatus
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAttendees(filteredAttendees.map((a) => a.id))
    } else {
      setSelectedAttendees([])
    }
  }

  const handleSelectAttendee = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedAttendees([...selectedAttendees, id])
    } else {
      setSelectedAttendees(selectedAttendees.filter((aid) => aid !== id))
    }
  }

  const attendeeStats = {
    total: attendees.length,
    checkedIn: attendees.filter((a) => a.checkInStatus === "Checked In").length,
    notCheckedIn: attendees.filter((a) => a.checkInStatus === "Not Checked In").length,
    noShow: attendees.filter((a) => a.checkInStatus === "No Show").length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Attendee Management
          </h1>
          <p className="text-gray-400 mt-2">Manage your event attendees and track check-ins.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
            Export Data
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            Send Message
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Attendees</p>
                <p className="text-2xl font-bold text-white">{attendeeStats.total}</p>
              </div>
              <div className="text-2xl">👥</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Checked In</p>
                <p className="text-2xl font-bold text-green-400">{attendeeStats.checkedIn}</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Not Checked In</p>
                <p className="text-2xl font-bold text-yellow-400">{attendeeStats.notCheckedIn}</p>
              </div>
              <div className="text-2xl">⏳</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">No Show</p>
                <p className="text-2xl font-bold text-red-400">{attendeeStats.noShow}</p>
              </div>
              <div className="text-2xl">❌</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search attendees by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="Web3 Conference 2024">Web3 Conference 2024</SelectItem>
                <SelectItem value="Blockchain Workshop">Blockchain Workshop</SelectItem>
                <SelectItem value="NFT Art Exhibition">NFT Art Exhibition</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="not-checked-in">Not Checked In</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedAttendees.length > 0 && (
        <Card className="bg-cyan-500/10 border-cyan-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400">
                {selectedAttendees.length} attendee{selectedAttendees.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                >
                  Send Message
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                >
                  Export Selected
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                >
                  Check In All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendees Table */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Attendees List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">
                    <Checkbox
                      checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Attendee</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Event</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Ticket Type</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Purchase Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Check-in Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-4 px-4">
                      <Checkbox
                        checked={selectedAttendees.includes(attendee.id)}
                        onCheckedChange={(checked) => handleSelectAttendee(attendee.id, checked as boolean)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${attendee.name}`} />
                          <AvatarFallback className="bg-gray-700 text-white text-xs">
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{attendee.name}</p>
                          <p className="text-sm text-gray-400">{attendee.email}</p>
                          <p className="text-xs text-gray-500 font-mono">{attendee.walletAddress}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">{attendee.event}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getTicketTypeColor(attendee.ticketType)}>{attendee.ticketType}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white">{attendee.purchaseDate}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <Badge className={getStatusColor(attendee.checkInStatus)}>{attendee.checkInStatus}</Badge>
                        {attendee.checkInTime && <p className="text-xs text-gray-400">{attendee.checkInTime}</p>}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem className="text-white hover:bg-gray-700">View Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-gray-700">Send Message</DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-gray-700">
                            {attendee.checkInStatus === "Checked In" ? "Undo Check-in" : "Check In"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-gray-700">Resend Ticket</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredAttendees.length === 0 && (
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-white mb-2">No attendees found</h3>
            <p className="text-gray-400">
              {searchTerm || eventFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No attendees have registered for your events yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
