"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Badge } from "../../../ui/badge"
import { Progress } from "../../../ui/progress"

export function DashboardOverview() {
  const stats = [
    { title: "Total Events", value: "24", change: "+12%", trend: "up" },
    { title: "Active Events", value: "8", change: "+3", trend: "up" },
    { title: "Total Revenue", value: "$45,230", change: "+18%", trend: "up" },
    { title: "Tickets Sold", value: "1,847", change: "+25%", trend: "up" },
  ]

  const recentEvents = [
    { name: "Web3 Conference 2024", date: "Dec 15, 2024", status: "Active", sold: 245, total: 300 },
    { name: "Blockchain Workshop", date: "Dec 20, 2024", status: "Active", sold: 89, total: 150 },
    { name: "NFT Art Exhibition", date: "Dec 25, 2024", status: "Draft", sold: 0, total: 200 },
    { name: "DeFi Summit", date: "Jan 5, 2025", status: "Draft", sold: 0, total: 500 },
  ]

  const recentActivity = [
    { action: "New ticket purchase", event: "Web3 Conference 2024", time: "2 minutes ago" },
    { action: "Event published", event: "Blockchain Workshop", time: "1 hour ago" },
    { action: "Ticket refund processed", event: "Web3 Conference 2024", time: "3 hours ago" },
    { action: "New attendee registered", event: "Web3 Conference 2024", time: "5 hours ago" },
    { action: "Event updated", event: "NFT Art Exhibition", time: "1 day ago" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-2">Welcome back! Here's what's happening with your events.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            Create Event
          </Button>
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recent Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{event.name}</h3>
                  <p className="text-sm text-gray-400">{event.date}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-400">Tickets Sold</span>
                      <span className="text-white">
                        {event.sold}/{event.total}
                      </span>
                    </div>
                    <Progress value={(event.sold / event.total) * 100} className="h-2 bg-gray-700" />
                  </div>
                </div>
                <div className="ml-4">
                  <Badge
                    variant={event.status === "Active" ? "default" : "secondary"}
                    className={
                      event.status === "Active"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/30 transition-colors">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-400">{activity.event}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-gray-700 hover:bg-gray-800 hover:border-cyan-500/50 bg-transparent"
            >
              <span className="text-2xl">🎫</span>
              <span>Create Event</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-gray-700 hover:bg-gray-800 hover:border-cyan-500/50 bg-transparent"
            >
              <span className="text-2xl">📊</span>
              <span>View Analytics</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-gray-700 hover:bg-gray-800 hover:border-cyan-500/50 bg-transparent"
            >
              <span className="text-2xl">👥</span>
              <span>Manage Attendees</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-gray-700 hover:bg-gray-800 hover:border-cyan-500/50 bg-transparent"
            >
              <span className="text-2xl">💰</span>
              <span>View Revenue</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
            <div className="text-center">
              <p className="text-gray-400 mb-2">Chart Component</p>
              <p className="text-sm text-gray-500">Sales performance chart will be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
