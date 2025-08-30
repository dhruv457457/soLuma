import { useEffect, useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Progress } from "../../../ui/progress";
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
  Copy,
  Check,
  Wallet,
  Plus,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import {
  getOrganizerEvents,
  getDashboardStats,
  subscribeToRecentActivity,
} from "../../../lib/dashboard";
import type { EventDoc, OrderDoc } from "../../../types/ticketing";
import { ensureFirebaseAuth } from "../../../config/firebase";
import PaymentQR from "../../../ui/PaymentQr";
import { Link } from "react-router-dom";

// Copy to clipboard hook
function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return { isCopied, copyToClipboard };
}

export function MergedDashboard() {
  const { accounts } = useSolanaWallet();
  const organizerWallet = accounts?.[0] || "";
  const isConnected = !!organizerWallet;
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [stats, setStats] = useState<{
    totalRevenue: { SOL: number; USDC: number };
    totalTicketsSold: number;
    activeEvents: number;
  }>({
    totalRevenue: { SOL: 0, USDC: 0 },
    totalTicketsSold: 0,
    activeEvents: 0,
  });
  const [recentOrders, setRecentOrders] = useState<OrderDoc[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    (async () => {
      try {
        await ensureFirebaseAuth();
        setIsAuthReady(true);
      } catch (e) {
        console.error("Auth failed:", e);
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
        const orgEventsRaw = await getOrganizerEvents(organizerWallet);
        // Map to ensure all required EventDoc fields are present
        const orgEvents: EventDoc[] = orgEventsRaw.map((event: any) => ({
          id: event.id || "",
          title: event.title || "",
          slug: event.slug || "",
          bannerUrl: event.bannerUrl || "",
          description: event.description || "",
          startsAt: event.startsAt || "",
          endsAt: event.endsAt || "",
          venue: event.venue || "",
          currency: event.currency || "SOL",
          priceLamports:
            typeof event.priceLamports === "number" ? event.priceLamports : 0,
          receiverWallet: event.receiverWallet || "",
          capacity: typeof event.capacity === "number" ? event.capacity : 0,
          salesCount:
            typeof event.salesCount === "number" ? event.salesCount : 0,
          createdBy: event.createdBy || "",
          status: event.status || "draft",
          splToken: event.splToken || "",
        }));
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

  // Fetch recent activity
  useEffect(() => {
    if (!isAuthReady || !isConnected || events.length === 0) {
      return;
    }

    let unsubscribe: (() => void) | null = null;

    async function setupActivitySubscription() {
      try {
        // Get event IDs for the organizer
        const eventIds = events.map(event => event.id);
        
        // Subscribe to recent activity for these events
        unsubscribe = await subscribeToRecentActivity(
          eventIds,
          (newOrders: OrderDoc[]) => {
            setRecentOrders(prevOrders => {
              // Merge new orders with existing ones, avoiding duplicates
              const allOrders = [...newOrders, ...prevOrders];
              const uniqueOrders = allOrders.filter((order, index, self) => 
                index === self.findIndex(o => o.id === order.id)
              );
              // Sort by creation date (newest first) and take latest 10
              return uniqueOrders
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 10);
            });
          }
        );
      } catch (error) {
        console.error("Failed to subscribe to recent activity:", error);
        // Fallback: fetch recent orders once
        fetchRecentOrders();
      }
    }

    async function fetchRecentOrders() {
      try {
        // Mock recent orders data for demonstration
        // In a real implementation, you would fetch from your database
        const mockOrders: OrderDoc[] = events.slice(0, 3).map((event, index) => ({
          id: `order-${Date.now()}-${index}`,
          eventId: event.id,
          buyerWallet: `buyer-${index + 1}`,
          qty: Math.floor(Math.random() * 3) + 1,
          totalAmount: event.priceLamports * (Math.floor(Math.random() * 3) + 1),
          currency: event.currency,
          status: 'completed',
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          transactionSignature: `tx-${Date.now()}-${index}`,
        }));
        
        setRecentOrders(mockOrders);
      } catch (error) {
        console.error("Failed to fetch recent orders:", error);
      }
    }

    setupActivitySubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAuthReady, isConnected, events]);

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "SOL") return `${(amount / 1e9).toFixed(4)} SOL`;
    if (currency === "USDC") return `${(amount / 1e6).toFixed(2)} USDC`;
    return `${amount} ${currency}`;
  };
  const formatWalletAddress = (address: string) => {
    if (!address) return "Not connected";
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black">
        <div className="w-8 h-8 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Manage your events and track performance
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            {/* Create Event Button */}
            <div className="relative group">
              <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 "></div>
              <Link
                to="/dashboard/events/new"
                className="cursor-pointer relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-black border border-transparent rounded-full w-full sm:w-auto"
                role="button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Link>
            </div>

            {/* View Analytics Button */}
            <div className="relative group">
              <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-indigo-500 to-pink-500"></div>
              <Link
                to="/"
                className="cursor-pointer relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-black border border-transparent rounded-full disabled:opacity-50 w-full sm:w-auto"
                role="button"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </div>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Total Events
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {events.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-900/40">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Active Events
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats.activeEvents}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-900/40">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Total Revenue
                  </p>
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(stats.totalRevenue.SOL, "SOL")}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatCurrency(stats.totalRevenue.USDC, "USDC")}
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-yellow-900/40">
                  <DollarSign className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">
                    Tickets Sold
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalTicketsSold}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-900/40">
                  <Ticket className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Wallet QR Code - Takes full width on mobile, 1/3 on desktop */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-xl font-semibold text-white">
                  Wallet QR Code
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="flex justify-center">
                {isConnected && organizerWallet ? (
                  <PaymentQR url={`solana:${organizerWallet}`} />
                ) : (
                  <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl shadow max-w-xs text-center flex flex-col items-center opacity-60">
                    <div className="rounded-xl w-[220px] h-[220px] bg-gray-900 flex items-center justify-center">
                      <span className="text-gray-500">QR Code</span>
                    </div>
                    <div className="text-[11px] mt-2 break-all text-gray-500">
                      Not connected
                    </div>
                  </div>
                )}
              </div>
              {isConnected ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-950 rounded-lg border border-gray-800">
                    <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                      Wallet Address
                    </p>
                    <p className="text-sm text-white font-mono break-all bg-gray-900 p-3 rounded-md border border-gray-800">
                      {formatWalletAddress(organizerWallet)}
                    </p>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(organizerWallet)}
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
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
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    Connect your wallet to display QR code and share your
                    address
                  </p>
                  <Button
                    onClick={() =>
                      window.dispatchEvent(new Event("connect-wallet"))
                    }
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Events - Takes 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <CardTitle className="text-xl font-semibold text-white">
                    Recent Events
                  </CardTitle>
                </div>
                {events.length > 5 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    View All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className={`space-y-4 ${events.length > 4 ? 'max-h-96 overflow-y-auto scrollbar-hide' : ''}`}>
              {events.length > 0 ? (
                events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-gray-800 bg-gray-950"
                  >
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white text-lg">
                          {event.title}
                        </h4>
                        <Badge
                          variant={
                            event.status === "published"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            event.status === "published"
                              ? "bg-green-900/40 text-green-400 border-green-700"
                              : "bg-gray-900/40 text-gray-400 border-gray-700"
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
                      <p className="text-sm text-gray-400 mb-3">
                        {new Date(event.startsAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Sales Progress</span>
                          <span className="font-medium text-white">
                            {event.salesCount}/{event.capacity}
                          </span>
                        </div>
                        <Progress
                          value={(event.salesCount / event.capacity) * 100}
                          className="h-2 bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <CalendarPlus className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    No events created yet
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Get started by creating your first event
                  </p>
                  <Button
                    onClick={() =>
                      (window.location.href = "/dashboard/events/new")
                    }
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity - Full width */}
      <div className="mt-6 sm:mt-8">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <CardTitle className="text-xl font-semibold text-white">
                Recent Activity
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className={`${recentOrders.length > 4 ? 'max-h-96 overflow-y-auto scrollbar-hide' : ''}`}>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order) => {
                  // Find the associated event
                  const event = events.find(e => e.id === order.eventId);
                  return (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-800 bg-gray-950"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">
                          New ticket purchase
                        </p>
                        <p className="text-sm text-gray-400">
                          {order.qty} ticket(s) - {event?.title || `Event #${order.eventId.slice(-6)}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-cyan-400 font-mono">
                          {formatCurrency(order.totalAmount, order.currency)}
                        </p>
                      </div>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No recent activity
                </h3>
                <p className="text-gray-400">
                  Ticket purchases and events will appear here once you start
                  selling
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call to Action for Empty State */}
      {events.length === 0 && (
        <div className="mt-8">
          <Card className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800">
            <CardContent className="p-8 text-center">
              <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Ready to Get Started?
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto text-lg">
                Create your first event to start selling tickets and building
                your community on Solana.
              </p>
              <Button
                onClick={() => (window.location.href = "/dashboard/events/new")}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border border-cyan-400 text-white px-8 py-4 rounded-full font-medium text-lg"
              >
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}