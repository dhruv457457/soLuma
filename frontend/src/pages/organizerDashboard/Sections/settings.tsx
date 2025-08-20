"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Switch } from "../../../ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"

export function Settings() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Manage your account and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Soluma" />
                  <AvatarFallback>SO</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              <div>
                <Label htmlFor="full-name" className="text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  defaultValue="Soluma Organizer"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <Input id="email" type="email" defaultValue="organizer@soluma.io" className="bg-gray-800 border-gray-700 text-white mt-2" />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" className="bg-gray-800 border-gray-700 text-white mt-2" />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" className="bg-gray-800 border-gray-700 text-white mt-2" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="2fa" className="text-gray-300">
                  Two-Factor Authentication
                </Label>
                <Switch id="2fa" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="event-updates" className="text-gray-300">
                  Event Updates
                </Label>
                <Switch id="event-updates" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ticket-sales" className="text-gray-300">
                  New Ticket Sales
                </Label>
                <Switch id="ticket-sales" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="payouts" className="text-gray-300">
                  Payout Confirmations
                </Label>
                <Switch id="payouts" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reminders" className="text-gray-300">
                  Event Reminders
                </Label>
                <Switch id="reminders" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
          Save Changes
        </Button>
      </div>
    </div>
  )
}