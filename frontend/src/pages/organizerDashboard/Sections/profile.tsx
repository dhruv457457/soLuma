"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Textarea } from "../../../ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"

export function Profile() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Organizer Profile
        </h1>
        <p className="text-gray-400 mt-2">This information will be displayed publicly on your event pages.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Public Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Soluma" />
                  <AvatarFallback>SO</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
                    Upload new picture
                  </Button>
                  <p className="text-sm text-gray-500">Recommended size: 400x400px</p>
                </div>
              </div>
              <div>
                <Label htmlFor="organizer-name" className="text-gray-300">
                  Organizer Name
                </Label>
                <Input
                  id="organizer-name"
                  placeholder="Your name or company"
                  defaultValue="Soluma Events"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
              <div>
                <Label htmlFor="organizer-bio" className="text-gray-300">
                  Bio
                </Label>
                <Textarea
                  id="organizer-bio"
                  placeholder="Tell attendees about yourself"
                  rows={4}
                  defaultValue="Your premier host for cutting-edge Web3 and blockchain events. Join us to explore the future of decentralized technology."
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="website" className="text-gray-300">
                  Website
                </Label>
                <Input id="website" placeholder="https://..." defaultValue="https://soluma.io" className="mt-2 bg-gray-800 border-gray-700 text-white" />
              </div>
              <div>
                <Label htmlFor="twitter" className="text-gray-300">
                  Twitter
                </Label>
                <Input id="twitter" placeholder="@username" defaultValue="@soluma_events" className="bg-gray-800 border-gray-700 text-white mt-2" />
              </div>
              <div>
                <Label htmlFor="discord" className="text-gray-300">
                  Discord
                </Label>
                <Input id="discord" placeholder="Invite link" defaultValue="discord.gg/soluma" className="bg-gray-800 border-gray-700 text-white mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Preview */}
        <div className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Preview</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-cyan-500/50">
                <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Soluma" />
                <AvatarFallback>SO</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-white">Soluma Events</h2>
              <p className="text-gray-400 mt-2">
                Your premier host for cutting-edge Web3 and blockchain events. Join us to explore the future of decentralized technology.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
                  Website
                </Button>
                <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800 bg-transparent">
                  Twitter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
          Update Profile
        </Button>
      </div>
    </div>
  )
}