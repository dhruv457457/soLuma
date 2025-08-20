"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Textarea } from "../../../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Switch } from "../../../ui/switch"
import { Badge } from "../../../ui/badge"

export function CreateEvent() {
  const [ticketTypes, setTicketTypes] = useState([{ id: 1, name: "General Admission", price: "50", quantity: "100" }])

  const addTicketType = () => {
    const newId = Math.max(...ticketTypes.map((t) => t.id)) + 1
    setTicketTypes([...ticketTypes, { id: newId, name: "", price: "", quantity: "" }])
  }

  const removeTicketType = (id: number) => {
    setTicketTypes(ticketTypes.filter((t) => t.id !== id))
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Create New Event
          </h1>
          <p className="text-gray-400 mt-2">Set up your event details and ticket information.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
            Save Draft
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            Publish Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="event-name" className="text-gray-300">
                  Event Name
                </Label>
                <Input
                  id="event-name"
                  placeholder="Enter event name"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <Label htmlFor="event-description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="event-description"
                  placeholder="Describe your event..."
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-date" className="text-gray-300">
                    Event Date
                  </Label>
                  <Input id="event-date" type="date" className="bg-gray-800 border-gray-700 text-white" />
                </div>
                <div>
                  <Label htmlFor="event-time" className="text-gray-300">
                    Event Time
                  </Label>
                  <Input id="event-time" type="time" className="bg-gray-800 border-gray-700 text-white" />
                </div>
              </div>
              <div>
                <Label htmlFor="event-location" className="text-gray-300">
                  Location
                </Label>
                <Input
                  id="event-location"
                  placeholder="Event venue or online link"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Ticket Types */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-white">Ticket Types</CardTitle>
              <Button onClick={addTicketType} size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                Add Ticket Type
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticketTypes.map((ticket, index) => (
                <div key={ticket.id} className="p-4 border border-gray-700 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">Ticket Type {index + 1}</h4>
                    {ticketTypes.length > 1 && (
                      <Button
                        onClick={() => removeTicketType(ticket.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-gray-300">Name</Label>
                      <Input
                        value={ticket.name}
                        onChange={(e) => {
                          const updated = ticketTypes.map((t) =>
                            t.id === ticket.id ? { ...t, name: e.target.value } : t,
                          )
                          setTicketTypes(updated)
                        }}
                        placeholder="Ticket name"
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Price (SOL)</Label>
                      <Input
                        value={ticket.price}
                        onChange={(e) => {
                          const updated = ticketTypes.map((t) =>
                            t.id === ticket.id ? { ...t, price: e.target.value } : t,
                          )
                          setTicketTypes(updated)
                        }}
                        placeholder="0.00"
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Quantity</Label>
                      <Input
                        value={ticket.quantity}
                        onChange={(e) => {
                          const updated = ticketTypes.map((t) =>
                            t.id === ticket.id ? { ...t, quantity: e.target.value } : t,
                          )
                          setTicketTypes(updated)
                        }}
                        placeholder="100"
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Event Image */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Event Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-cyan-500/50 transition-colors">
                <div className="space-y-2">
                  <div className="text-4xl">📸</div>
                  <p className="text-gray-400">Click to upload event image</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Event Settings */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Event Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="event-category" className="text-gray-300">
                  Category
                </Label>
                <Select>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="exhibition">Exhibition</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="public-event" className="text-gray-300">
                  Public Event
                </Label>
                <Switch id="public-event" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="allow-transfers" className="text-gray-300">
                  Allow Ticket Transfers
                </Label>
                <Switch id="allow-transfers" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="require-approval" className="text-gray-300">
                  Require Approval
                </Label>
                <Switch id="require-approval" />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Event Image</span>
                </div>
                <h3 className="font-semibold text-white">Event Name</h3>
                <p className="text-sm text-gray-400">Event description will appear here...</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                    Conference
                  </Badge>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Public
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
