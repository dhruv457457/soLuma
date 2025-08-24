import { useEffect, useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Progress } from "../../../ui/progress";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { 
  Calendar, 
  Activity, 
  DollarSign, 
  Ticket, 
  CalendarPlus, 
  Bell, 
  Rocket, 
  CheckCircle,
  Clock,
  TicketX,
  Copy,
  Check,
  Wallet,
  User,
  Globe,
  Twitter,
  MessageCircle,
  QrCode
} from "lucide-react";
import {
  getOrganizerEvents,
  getDashboardStats,
  subscribeToRecentActivity,
} from "../../../lib/dashboard";
import type { EventDoc, OrderDoc } from "../../../types/ticketing";
import { ensureFirebaseAuth } from "../../../config/firebase";

// QR Code Component
function WalletQRCode({ walletAddress, isConnected }) {
  const [qrCodeData, setQrCodeData] = useState("");

  useEffect(() => {
    if (walletAddress) {
      // Generate QR code data URL for the wallet address
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = 200;
      
      // Simple QR code placeholder pattern (in real app, use a QR library)
      ctx.fillStyle = isConnected ? '#000000' : '#999999';
      
      // Create a grid pattern to simulate QR code
      const gridSize = 10;
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if (Math.random() > 0.5) {
            ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
          }
        }
      }
      
      // Convert to data URL
      setQrCodeData(canvas.toDataURL());
    }
  }, [walletAddress, isConnected]);

  return (
    <div className="relative">
      <div className={`bg-white p-4 rounded-lg ${!isConnected ? 'blur-sm' : ''}`}>
        {qrCodeData ? (
          <img src={qrCodeData} alt="Wallet QR Code" className="w-48 h-48 mx-auto" />
        ) : (
          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
            <QrCode className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm">
            Connect wallet to view
          </div>
        </div>
      )}
    </div>
  );
}

// Copy to clipboard hook
function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return { isCopied, copyToClipboard };
}

export function MergedDashboard() {
  const { accounts, connect } = useSolanaWallet();
  const organizerWallet = accounts?.[0] || '';
  const isConnected = !!organizerWallet;
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: { SOL: 0, USDC: 0 },
    totalTicketsSold: 0,
    activeEvents: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  // Profile state
  const [profile, setProfile] = useState({
    name: "Soluma Events",
    bio: "Your premier host for cutting-edge Web3 and blockchain events. Join us to explore the future of decentralized technology.",
    website: "https://soluma.io",
    twitter: "@soluma_events",
    discord: "discord.gg/soluma"
  });

  useEffect(() => {
    (async () => {
      try {
        await ensureFirebaseAuth();
        setIsAuthReady(true);
      } catch (e) {
        console.error("Auth failed:", e.message);
        setDataLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !isConnected) {
      setDataLoading(false);
      return;
    }

    setDataLoading(true);

    async function fetchData() {
      try {
        const orgEvents = await getOrganizerEvents(organizerWallet);
        setEvents(orgEvents);
        const fetchedStats = await getDashboardStats(orgEvents);
        setStats(fetchedStats);
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
      } finally {
        setDataLoading(false);
      }
    }
    fetchData();
  }, [isAuthReady, organizerWallet, isConnected]);

  const formatCurrency = (amount, currency) => {
    if (currency === "SOL") return `${(amount / 1e9).toFixed(4)} SOL`;
    if (currency === "USDC") return `${(amount / 1e6).toFixed(2)} USDC`;
    return `${amount} ${currency}`;
  };

  const formatWalletAddress = (address) => {
    if (!address) return "Not connected";
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-400">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
             Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your events, track performance, and connect with your community
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative inline-flex items-center justify-center group">
            <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-blue-500"></div>
            <button
              onClick={() => (window.location.href = "/dashboard/events/new")}
              className="relative inline-flex items-center justify-center px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full"
            >
              Create Event
            </button>
          </div>
          <div className="relative inline-flex items-center justify-center group">
            <div className="absolute transition-all duration-300 rounded-full -inset-px bg-gradient-to-r from-slate-500 to-gray-400 opacity-70 group-hover:opacity-100"></div>
            <button
              disabled={events.length === 0}
              className="relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-black border border-transparent rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/70 border border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Total Events</p>
                <p className="text-2xl font-bold text-white">{events.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/20">
                <Calendar className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/70 border border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Active Events</p>
                <p className="text-2xl font-bold text-white">{stats.activeEvents}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/70 border border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Total Revenue</p>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-white">
                    {formatCurrency(stats.totalRevenue.SOL, "SOL")}
                  </p>
                  <p className="text-sm text-gray-300">
                    {formatCurrency(stats.totalRevenue.USDC, "USDC")}
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/70 border border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Tickets Sold</p>
                <p className="text-2xl font-bold text-white">{stats.totalTicketsSold}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Ticket className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile and Wallet Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm h-[480px]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              <CardTitle className="text-xl text-white">Profile Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex flex-col h-full">
            <div className="flex items-start gap-6 flex-1">
              <Avatar className="w-28 h-28 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20">
                <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Soluma" />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500/30 to-blue-500/30 text-cyan-400 text-2xl font-bold">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {profile.name}
                </h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                  {profile.bio}
                </p>
                <div className="space-y-3">
                  {profile.website && (
                    <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-cyan-400 transition-colors group">
                      <div className="p-1.5 rounded-md bg-gray-800/50 group-hover:bg-cyan-500/20 transition-colors">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="truncate">{profile.website}</span>
                    </div>
                  )}
                  {profile.twitter && (
                    <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-cyan-400 transition-colors group">
                      <div className="p-1.5 rounded-md bg-gray-800/50 group-hover:bg-cyan-500/20 transition-colors">
                        <Twitter className="w-4 h-4" />
                      </div>
                      <span className="truncate">{profile.twitter}</span>
                    </div>
                  )}
                  {profile.discord && (
                    <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-cyan-400 transition-colors group">
                      <div className="p-1.5 rounded-md bg-gray-800/50 group-hover:bg-cyan-500/20 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <span className="truncate">{profile.discord}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-700/50">
              <div className="space-y-4">

                {/* Edit Profile Button */}
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-gray-600 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-gray-300 hover:text-cyan-400 transition-all duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet QR Code Section */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm h-[480px]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-cyan-400" />
              <CardTitle className="text-xl text-white">Wallet QR Code</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center flex flex-col justify-center h-full space-y-6">
            <div className="flex justify-center">
              <WalletQRCode walletAddress={organizerWallet} isConnected={isConnected} />
            </div>
            
            {isConnected ? (
              <div className="space-y-4 max-w-sm mx-auto">
                <div className="p-4 bg-gradient-to-br from-gray-800/60 to-gray-800/40 rounded-xl border border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Wallet Address</p>
                  <p className="text-sm text-white font-mono break-all bg-gray-900/50 p-2 rounded-lg border border-gray-700/30">
                    {formatWalletAddress(organizerWallet)}
                  </p>
                </div>
                <Button
                  onClick={() => copyToClipboard(organizerWallet)}
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-600 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-gray-300 hover:text-cyan-400 transition-all duration-200"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Address Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Full Address
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 max-w-sm mx-auto">
                <p className="text-sm text-gray-400 mb-4">
                  Connect your wallet to display QR code and share your address
                </p>
                <div className="relative inline-flex items-center justify-center group">
                  <div className="absolute transition-all duration-300 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-blue-500 opacity-75 group-hover:opacity-100"></div>
                  <button
                    onClick={connect}
                    className="relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-black border border-transparent rounded-full hover:bg-gray-900 transition-colors duration-200"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Events and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm h-[500px]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <CardTitle className="text-xl text-white">Recent Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-full overflow-y-auto">
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(event.startsAt).toLocaleDateString()}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">Sales Progress</span>
                          <span className="text-white">
                            {event.salesCount}/{event.capacity}
                          </span>
                        </div>
                        <Progress 
                          value={(event.salesCount / event.capacity) * 100} 
                          className="h-2 bg-gray-700"
                        />
                      </div>
                    </div>
                    <div className="ml-6">
                      <Badge
                        variant={event.status === "published" ? "default" : "secondary"}
                        className={
                          event.status === "published"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }
                      >
                        {event.status === "published" ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Live
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Draft
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 h-full flex flex-col justify-center">
                <CalendarPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2 text-lg">No events created yet</p>
                <p className="text-sm text-gray-500">
                  Your events will appear here once you create them
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm h-[500px]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-full overflow-y-auto">
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">New ticket purchase</p>
                      <p className="text-xs text-gray-400 truncate">
                        {order.qty} ticket(s) - Event #{order.eventId.slice(-6)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 h-full flex flex-col justify-center">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2 text-lg">No recent activity</p>
                <p className="text-sm text-gray-500 mb-4">
                  Ticket purchases and other activities will show up here
                </p>
                {events.length === 0 && (
                  <p className="text-xs text-gray-600">
                    Create an event first to start seeing activity
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      {events.length === 0 && (
        <Card className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-3">Ready to Get Started?</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Create your first event to start selling tickets and building your community on Solana.
            </p>
            <div className="relative inline-flex items-center justify-center group">
              <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-blue-500 "></div>
              <button
                onClick={() => (window.location.href = "/dashboard/events/new")}
                className="relative inline-flex items-center justify-center px-8 py-3 text-lg font-normal text-white bg-black border border-transparent rounded-full"
              >
                Create Your First Event
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}