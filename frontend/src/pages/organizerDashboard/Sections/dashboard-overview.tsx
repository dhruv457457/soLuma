// src/pages/organizerDashboard/Sections/dashboard-overview.tsx

"use client";

import { useEffect, useState } from "react";
// Now we can re-add the hook because the component is in the right place
import { useSolanaWallet } from "@web3auth/modal/react/solana";

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Progress } from "../../../ui/progress";

import {
  getOrganizerEvents,
  getDashboardStats,
  subscribeToRecentActivity,
} from "../../../lib/dashboard";
import type { EventDoc, OrderDoc } from "../../../types/ticketing";
import { ensureFirebaseAuth } from "../../../config/firebase";

export function DashboardOverview() {
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

  // Step 1: Wait for Firebase auth to be ready
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

  // Step 2: Load dashboard data only after auth and wallet connection are ready
  useEffect(() => {
    // Only proceed if auth is ready
    if (!isAuthReady) {
      return;
    }

    if (!isConnected) {
      console.warn("Please connect your wallet to view the dashboard");
      setDataLoading(false);
      return;
    }

    console.log("Fetching dashboard data for:", organizerWallet);
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

  // Step 3: Set up the real-time listener for recent activity
  useEffect(() => {
    if (events.length === 0 || !isConnected) return;

    const eventIds = events.map(e => e.id);
    const unsubscribe = subscribeToRecentActivity(eventIds, (orders) => {
      console.log("Real-time orders update:", orders.length, "orders found.");
      setRecentOrders(orders);
    });
    
    return () => {
      console.log("Unsubscribing from real-time activity.");
      unsubscribe();
    };
  }, [events, isConnected]);

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
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
      {/* ... (rest of the JSX remains unchanged) ... */}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-400 mb-1">Total Events</p>
            <p className="text-2xl font-bold text-white">{events.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-400 mb-1">Active Events</p>
            <p className="text-2xl font-bold text-white">{stats.activeEvents}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(stats.totalRevenue.SOL, "SOL")}
              <br/>
              {formatCurrency(stats.totalRevenue.USDC, "USDC")}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-400 mb-1">Tickets Sold</p>
            <p className="text-2xl font-bold text-white">{stats.totalTicketsSold}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recent Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.slice(0, 5).map((event) => (
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
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    }
                  >
                    {event.status === "published" ? "Active" : "Draft"}
                  </Badge>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-center text-gray-500">No events found.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.slice(0, 5).map((order) => (
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
            ))}
            {recentOrders.length === 0 && (
              <p className="text-center text-gray-500">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </div>

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
  );
}