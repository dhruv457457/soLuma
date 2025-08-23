// src/pages/organizerDashboard/Sections/dashboard-overview.tsx

"use client";

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
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
  TicketX,
} from "lucide-react";
import {
  getOrganizerEvents,
  getDashboardStats,
  subscribeToRecentActivity,
} from "../../../lib/dashboard";
import type { EventDoc, OrderDoc } from "../../../types/ticketing";
import { ensureFirebaseAuth } from "../../../config/firebase";

function OrganizerDashboardView() {
    const { accounts } = useSolanaWallet();
    const organizerWallet = accounts?.[0] || '';
    const isConnected = !!organizerWallet;
    const [events, setEvents] = useState<EventDoc[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: { SOL: 0, USDC: 0 },
        totalTicketsSold: 0,
        activeEvents: 0,
    });
    const [recentOrders, setRecentOrders] = useState<OrderDoc[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await ensureFirebaseAuth();
                setIsAuthReady(true);
            } catch (e: any) {
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
                setEvents(orgEvents as EventDoc[]);
                const fetchedStats = await getDashboardStats(orgEvents as EventDoc[]);
                setStats(fetchedStats);
            } catch (e) {
                console.error("Failed to fetch dashboard data:", e);
            } finally {
                setDataLoading(false);
            }
        }
        fetchData();
    }, [isAuthReady, organizerWallet, isConnected]);
    
    if (dataLoading) {
        return (
          <div className="flex flex-col justify-center items-center h-screen text-gray-400">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        );
    }

    const formatCurrency = (amount: number, currency: string) => {
        if (currency === "SOL") return `${(amount / 1e9).toFixed(4)} SOL`;
        if (currency === "USDC") return `${(amount / 1e6).toFixed(2)} USDC`;
        return `${amount} ${currency}`;
    };

    return (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-400 mt-2">
                {events.length === 0 
                  ? "Welcome! Create your first event to get started." 
                  : "Welcome back! Here's what's happening with your events."
                }
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative inline-flex items-center justify-center group">
                <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                <button
                  onClick={() => window.location.href = '/dashboard/events/new'}
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
    
          {/* Stats Cards - Enhanced with better spacing and icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Total Events */}
  <Card className="bg-gray-900/70 border border-gray-800 rounded-lg backdrop-blur-sm hover:shadow-md hover:shadow-cyan-500/10 transition-all duration-300">
    <CardContent className="flex items-center justify-between p-3">
      <div>
        <p className="text-xs text-gray-400">Total Events</p>
        <p className="text-lg font-bold text-white">{events.length}</p>
        {events.length === 0 && (
          <p className="text-[11px] text-gray-500">No events created yet</p>
        )}
      </div>
      <div className="p-1.5 rounded-md bg-gray-800/60">
        <Calendar className="w-7 h-7 text-cyan-400" />
      </div>
    </CardContent>
  </Card>

  {/* Active Events */}
  <Card className="bg-gray-900/70 border border-gray-800 rounded-lg backdrop-blur-sm hover:shadow-md hover:shadow-green-500/10 transition-all duration-300">
    <CardContent className="flex items-center justify-between p-3">
      <div>
        <p className="text-xs text-gray-400">Active Events</p>
        <p className="text-lg font-bold text-white">{stats.activeEvents}</p>
        {stats.activeEvents === 0 && (
          <p className="text-[11px] text-gray-500">No active events</p>
        )}
      </div>
      <div className="p-1.5 rounded-md bg-gray-800/60">
        <Activity className="w-7 h-7 text-green-400" />
      </div>
    </CardContent>
  </Card>

  {/* Total Revenue */}
  <Card className="bg-gray-900/70 border border-gray-800 rounded-lg backdrop-blur-sm hover:shadow-md hover:shadow-yellow-500/10 transition-all duration-300">
    <CardContent className="flex items-center justify-between p-3">
      <div>
        <p className="text-xs text-gray-400">Total Revenue</p>
        <div className="text-base font-bold text-white">
          <div>{formatCurrency(stats.totalRevenue.SOL, "SOL")}</div>
          <div className="text-xs text-gray-300">{formatCurrency(stats.totalRevenue.USDC, "USDC")}</div>
        </div>
        {stats.totalRevenue.SOL === 0 && stats.totalRevenue.USDC === 0 && (
          <p className="text-[11px] text-gray-500">No revenue yet</p>
        )}
      </div>
      <div className="p-1.5 rounded-md bg-gray-800/60">
        <DollarSign className="w-7 h-7 text-yellow-400" />
      </div>
    </CardContent>
  </Card>

  {/* Tickets Sold */}
  <Card className="bg-gray-900/70 border border-gray-800 rounded-lg backdrop-blur-sm hover:shadow-md hover:shadow-purple-500/10 transition-all duration-300">
    <CardContent className="flex items-center justify-between p-3">
      <div>
        <p className="text-xs text-gray-400">Tickets Sold</p>
        <p className="text-lg font-bold text-white">{stats.totalTicketsSold}</p>
        {stats.totalTicketsSold === 0 && (
          <p className="text-[11px] text-gray-500">No tickets sold yet</p>
        )}
      </div>
      <div className="p-1.5 rounded-md bg-gray-800/60">
        <TicketX className="w-7 h-7 text-purple-400" />
      </div>
    </CardContent>
  </Card>
</div>


          {/* Main Content - Always show both sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <CardTitle className="text-xl text-white">Recent Events</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.length > 0 ? (
                  events.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-400">{new Date(event.startsAt).toLocaleDateString()}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-400">Tickets Sold</span>
                            <span className="text-white">
                              {event.salesCount}/{event.capacity}
                            </span>
                          </div>
                          <Progress value={(event.salesCount / event.capacity) * 100} className="h-2 bg-gray-700" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <Badge
                          variant={event.status === "published" ? "default" : "secondary"}
                          className={
                            event.status === "published"
                              ? "bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30 flex items-center gap-1"
                          }
                        >
                          {event.status === "published" ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Draft
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="p-4 rounded-full bg-gray-800/50 w-fit mx-auto mb-4">
                      <CalendarPlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 mb-2 text-lg">No events created yet</p>
                    <p className="text-sm text-gray-500 mb-6">
                      Your events will appear here once you create them
                    </p>
                    <div className="relative inline-flex items-center justify-center group">
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/30 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-white font-medium">New ticket purchase</p>
                        <p className="text-sm text-gray-400">
                          {order.qty} ticket(s) for event {order.eventId.slice(0, 6)}...
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="p-4 rounded-full bg-gray-800/50 w-fit mx-auto mb-4">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 mb-2 text-lg">No activity yet</p>
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

          {/* Call to Action when no events - shown below the sections */}
          {events.length === 0 && (
            <Card className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-10 text-center">
                <div className="p-4 rounded-full bg-gray-800/50 w-fit mx-auto mb-6">
                  <Rocket className="w-12 h-12 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Ready to Get Started?</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
                  Create your first event to start selling tickets and building your community on Solana.
                </p>
                <div className="relative inline-flex items-center justify-center group">
                  <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-blue-500 "></div>
                  <button
                    onClick={() => window.location.href = '/dashboard/events/new'}
                    className="relative inline-flex items-center justify-center px-8 py-3 text-lg font-normal text-white bg-black border border-transparent rounded-full"
                  >
                    Create New Event
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
    );
}

function UserDashboardView() {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                Welcome to Soluma
            </h1>
            <p className="text-gray-400 text-lg mb-8">
                Explore events or create your own to bring your community together on-chain.
            </p>
            <div className="flex justify-center gap-4">
                <div className="relative inline-flex items-center justify-center group">
                  <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                  <button
                    onClick={() => window.location.href = '/dashboard/explore'}
                    className="relative inline-flex items-center justify-center px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full"
                  >
                    Explore Events
                  </button>
                </div>
                <div className="relative inline-flex items-center justify-center group">
                  <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-gray-500 to-gray-600 group-hover:shadow-lg group-hover:shadow-gray-500/50"></div>
                  <button
                    onClick={() => window.location.href = '/dashboard/events/new'}
                    className="relative inline-flex items-center justify-center px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full"
                  >
                    Create an Event
                  </button>
                </div>
            </div>
        </div>
    );
}

export function DashboardOverview() {
  // Always show organizer dashboard - remove this line when you fix the routing
  return <OrganizerDashboardView />;
  
  // Original logic (commented out for now):
  // const context = useOutletContext() as { isOrganizer?: boolean };
  // const { accounts } = useSolanaWallet();
  // const showOrganizerDashboard = context?.isOrganizer ?? !!accounts?.[0];
  // return showOrganizerDashboard ? <OrganizerDashboardView /> : <UserDashboardView />;
}