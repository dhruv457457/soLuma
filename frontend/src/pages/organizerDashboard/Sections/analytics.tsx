"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Badge } from "../../../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Progress } from "../../../ui/progress"

export function Analytics() {
  const performanceMetrics = [
    { title: "Total Views", value: "12,847", change: "+23%", trend: "up" },
    { title: "Conversion Rate", value: "3.2%", change: "+0.8%", trend: "up" },
    { title: "Avg. Ticket Price", value: "$67", change: "-$3", trend: "down" },
    { title: "Customer Satisfaction", value: "4.8/5", change: "+0.2", trend: "up" },
  ]

  const topEvents = [
    { name: "Web3 Conference 2024", views: 3420, sales: 245, conversion: "7.2%" },
    { name: "Blockchain Workshop", views: 2180, sales: 89, conversion: "4.1%" },
    { name: "NFT Art Exhibition", views: 1890, sales: 156, conversion: "8.3%" },
    { name: "DeFi Summit", views: 1650, sales: 78, conversion: "4.7%" },
  ]

  const audienceData = [
    { segment: "Age 18-25", percentage: 28, color: "bg-cyan-500" },
    { segment: "Age 26-35", percentage: 42, color: "bg-blue-500" },
    { segment: "Age 36-45", percentage: 22, color: "bg-purple-500" },
    { segment: "Age 46+", percentage: 8, color: "bg-gray-500" },
  ]

  const trafficSources = [
    { source: "Direct", visitors: 4250, percentage: 35 },
    { source: "Social Media", visitors: 3680, percentage: 30 },
    { source: "Search Engines", visitors: 2440, percentage: 20 },
    { source: "Email", visitors: 1220, percentage: 10 },
    { source: "Referrals", visitors: 610, percentage: 5 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Track your event performance and audience insights.</p>
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
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
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
        {/* Sales Trend Chart */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
              <div className="text-center">
                <p className="text-gray-400 mb-2">Line Chart Component</p>
                <p className="text-sm text-gray-500">Ticket sales over time visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Events */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Top Performing Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topEvents.map((event, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{event.name}</h3>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{event.conversion}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Views</p>
                    <p className="text-white font-medium">{event.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Sales</p>
                    <p className="text-white font-medium">{event.sales}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Audience Demographics */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {audienceData.map((segment, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{segment.segment}</span>
                  <span className="text-white">{segment.percentage}%</span>
                </div>
                <Progress value={segment.percentage} className="h-2 bg-gray-700" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span className="text-white">{source.source}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{source.visitors.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">{source.percentage}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
            <div className="text-center">
              <p className="text-gray-400 mb-2">World Map Component</p>
              <p className="text-sm text-gray-500">Attendee locations visualization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
