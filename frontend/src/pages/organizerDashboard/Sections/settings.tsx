"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Switch } from "../../../ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { User, Shield, Bell, Camera, Save } from "lucide-react"

export function Settings() {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-3">
            Account Settings
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Manage your profile, security preferences, and notification settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Profile Settings */}
            <Card className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-md rounded-xl shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-cyan-500/20 rounded-full">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Profile Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                  <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-gray-700/50">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Soluma" />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 text-lg font-semibold">SO</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div>
                      <Button variant="outline" className="border-gray-600 hover:bg-gray-700/50 bg-gray-800/50 text-gray-300 hover:text-white transition-colors duration-200">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      JPG, GIF or PNG. Maximum file size 1MB.
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full-name" className="text-sm font-medium text-gray-300">
                      Full Name
                    </Label>
                    <Input
                      id="full-name"
                      defaultValue="Soluma Organizer"
                      className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-300">
                      Username
                    </Label>
                    <Input
                      id="username"
                      defaultValue="soluma_organizer"
                      className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue="organizer@soluma.io" 
                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all duration-200" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    rows={3}
                    defaultValue="Professional event organizer passionate about creating memorable experiences."
                    className="w-full bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 rounded-md px-3 py-2 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all duration-200 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-md rounded-xl shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-full">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Security Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-sm font-medium text-gray-300">
                      Current Password
                    </Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all duration-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-sm font-medium text-gray-300">
                      New Password
                    </Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all duration-200" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">
                    Confirm New Password
                  </Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all duration-200" 
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                  <div className="space-y-1">
                    <Label htmlFor="2fa" className="text-sm font-medium text-gray-300">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-xs text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch id="2fa" className="data-[state=checked]:bg-cyan-500" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                  <div className="space-y-1">
                    <Label htmlFor="session-timeout" className="text-sm font-medium text-gray-300">
                      Session Timeout
                    </Label>
                    <p className="text-xs text-gray-500">
                      Automatically log out after inactivity
                    </p>
                  </div>
                  <Switch id="session-timeout" defaultChecked className="data-[state=checked]:bg-cyan-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            {/* Notification Settings */}
            <Card className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-md rounded-xl shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-full">
                    <Bell className="w-5 h-5 text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Notifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="space-y-1">
                    <Label htmlFor="event-updates" className="text-sm font-medium text-gray-300">
                      Event Updates
                    </Label>
                    <p className="text-xs text-gray-500">Important changes to your events</p>
                  </div>
                  <Switch id="event-updates" defaultChecked className="data-[state=checked]:bg-cyan-500" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="space-y-1">
                    <Label htmlFor="ticket-sales" className="text-sm font-medium text-gray-300">
                      New Ticket Sales
                    </Label>
                    <p className="text-xs text-gray-500">When someone buys a ticket</p>
                  </div>
                  <Switch id="ticket-sales" defaultChecked className="data-[state=checked]:bg-cyan-500" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="space-y-1">
                    <Label htmlFor="payouts" className="text-sm font-medium text-gray-300">
                      Payout Confirmations
                    </Label>
                    <p className="text-xs text-gray-500">Payment processing updates</p>
                  </div>
                  <Switch id="payouts" className="data-[state=checked]:bg-cyan-500" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="space-y-1">
                    <Label htmlFor="reminders" className="text-sm font-medium text-gray-300">
                      Event Reminders
                    </Label>
                    <p className="text-xs text-gray-500">Upcoming event notifications</p>
                  </div>
                  <Switch id="reminders" defaultChecked className="data-[state=checked]:bg-cyan-500" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="space-y-1">
                    <Label htmlFor="marketing" className="text-sm font-medium text-gray-300">
                      Marketing Emails
                    </Label>
                    <p className="text-xs text-gray-500">News and promotional content</p>
                  </div>
                  <Switch id="marketing" className="data-[state=checked]:bg-cyan-500" />
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="bg-gray-900/50 border border-gray-800/50 backdrop-blur-md rounded-xl shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700/50 bg-gray-800/50 text-gray-300 hover:text-white transition-colors duration-200">
                  Export Data
                </Button>
                <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700/50 bg-gray-800/50 text-gray-300 hover:text-white transition-colors duration-200">
                  Download Backup
                </Button>
                <Button variant="outline" className="w-full border-red-600/50 hover:bg-red-500/10 bg-gray-800/50 text-red-400 hover:text-red-300 transition-colors duration-200">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8 sm:mt-12">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}