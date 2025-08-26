"use client";

import { useEffect, useState } from "react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";

import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Badge } from "../../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { Progress } from "../../../ui/progress";
import { getOrganizerEvents } from "../../../lib/dashboard";
import type { EventDoc } from "../../../types/ticketing";
import {
  Calendar,
  LocateIcon,
  WatchIcon,
  Plus,
  Filter,
  X,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

// The parent component will pass this function
interface MyEventsProps {
  setActiveSection: (section: string, eventId?: string) => void;
}

export function MyEvents({ setActiveSection }: MyEventsProps) {
  const { accounts } = useSolanaWallet();
  const organizerWallet = accounts?.[0] || "";
  const isConnected = !!organizerWallet;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setDataLoading(false);
      return;
    }
    const fetchEvents = async () => {
      try {
        setDataLoading(true);
        const fetchedEvents = await getOrganizerEvents(organizerWallet);
        setEvents(fetchedEvents as EventDoc[]);
      } catch (e) {
        setEvents([]);
      } finally {
        setDataLoading(false);
      }
    };
    fetchEvents();
  }, [isConnected, organizerWallet]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status.toLowerCase() === statusFilter;

    // Date filtering
    let matchesDate = true;
    if (dateFilter !== "all") {
      const eventDate = new Date(event.startsAt);
      const today = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const oneMonth = 30 * 24 * 60 * 60 * 1000;

      switch (dateFilter) {
        case "upcoming":
          matchesDate = eventDate > today;
          break;
        case "this-week":
          matchesDate =
            eventDate > today &&
            eventDate.getTime() - today.getTime() <= oneWeek;
          break;
        case "this-month":
          matchesDate =
            eventDate > today &&
            eventDate.getTime() - today.getTime() <= oneMonth;
          break;
        case "past":
          matchesDate = eventDate < today;
          break;
      }
    }

    // Capacity filtering
    let matchesCapacity = true;
    if (capacityFilter !== "all") {
      const salesPercentage = (event.salesCount / event.capacity) * 100;
      switch (capacityFilter) {
        case "high-sales":
          matchesCapacity = salesPercentage >= 80;
          break;
        case "medium-sales":
          matchesCapacity = salesPercentage >= 40 && salesPercentage < 80;
          break;
        case "low-sales":
          matchesCapacity = salesPercentage < 40;
          break;
        case "sold-out":
          matchesCapacity = salesPercentage >= 100;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate && matchesCapacity;
  });

  const clearAllFilters = () => {
    setStatusFilter("all");
    setDateFilter("all");
    setCapacityFilter("all");
    setSearchTerm("");
  };

  const activeFiltersCount =
    [statusFilter, dateFilter, capacityFilter].filter(
      (filter) => filter !== "all"
    ).length + (searchTerm ? 1 : 0);

  // Loading State
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-400 p-4 text-center flex items-center justify-center">
        <div className="flex items-center gap-3 text-base sm:text-lg">
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          Loading your events...
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-black text-white sm:p-2 lg:p-4 relative">
      <div className="max-w-7xl mx-auto py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
            My Events
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Manage and track all your events in one place.
          </p>
        </div>

        {/* Search & Filter Bar - Mobile Optimized */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Search Input with Filter Button */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 sm:h-5 sm:w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-14 sm:pr-16 py-3 sm:py-4 bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl sm:rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm sm:text-base"
              />
              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center hover:text-cyan-400 transition-colors duration-200"
              >
                <div className="relative">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-cyan-400 transition-colors" />
                  {activeFiltersCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {activeFiltersCount}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Create Event Button */}
            <div className="relative hidden sm:block">
              <div className="absolute transition-all duration-200 rounded-xl sm:rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              <Link
                to="/dashboard/events/new"
                className="relative inline-flex items-center justify-center px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm lg:text-base font-normal text-white bg-black border border-transparent rounded-xl sm:rounded-full whitespace-nowrap"
                role="button"
              >
                <Plus className="w-4 h-4 sm:mr-2 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Create New</span>
                <span className="sm:hidden ml-1">New</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Sidebar */}
        <div
          className={`fixed inset-0 z-50 ${
            isFilterOpen ? "visible" : "invisible"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              isFilterOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsFilterOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl transform transition-transform duration-300 ease-out ${
              isFilterOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    Filters
                  </h3>
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-cyan-500/20 text-cyan-400 text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Status Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Event Status
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Events" },
                      { value: "published", label: "Active Events" },
                      { value: "draft", label: "Draft Events" },
                      { value: "completed", label: "Completed Events" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStatusFilter(option.value)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                          statusFilter === option.value
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                            : "bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        {statusFilter === option.value && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Event Date
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Dates" },
                      { value: "upcoming", label: "Upcoming" },
                      { value: "this-week", label: "This Week" },
                      { value: "this-month", label: "This Month" },
                      { value: "past", label: "Past Events" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDateFilter(option.value)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                          dateFilter === option.value
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                            : "bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        {dateFilter === option.value && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capacity Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Ticket Sales
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Sales Levels" },
                      { value: "sold-out", label: "Sold Out" },
                      { value: "high-sales", label: "High Sales (80%+)" },
                      { value: "medium-sales", label: "Medium Sales (40-80%)" },
                      { value: "low-sales", label: "Low Sales (<40%)" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setCapacityFilter(option.value)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                          capacityFilter === option.value
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                            : "bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        {capacityFilter === option.value && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-gray-700/50 space-y-3">
                <button
                  onClick={clearAllFilters}
                  disabled={activeFiltersCount === 0}
                  className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] w-full px-4">
            <div className="mb-4 sm:mb-6 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6 sm:w-10 sm:h-10"
                >
                  <rect
                    x="4"
                    y="8"
                    width="16"
                    height="8"
                    rx="3"
                    fill="#FFD600"
                  />
                  <circle cx="8" cy="12" r="1.5" fill="#333" />
                  <circle cx="12" cy="12" r="1.5" fill="#333" />
                  <circle cx="16" cy="12" r="1.5" fill="#333" />
                </svg>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
              {searchTerm || activeFiltersCount > 0
                ? "No Events Found"
                : "No Events"}
            </h3>
            <p className="text-gray-400 mb-6 sm:mb-8 text-center text-sm sm:text-base max-w-sm">
              {searchTerm || activeFiltersCount > 0
                ? "Try adjusting your search or filter criteria."
                : "Create your first event to get started."}
            </p>
            {(searchTerm || activeFiltersCount > 0) && (
              <button
                onClick={clearAllFilters}
                className="mb-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium underline"
              >
                Clear all filters
              </button>
            )}
            <div className="relative group w-full max-w-xs sm:max-w-sm h-12 sm:h-14 mb-2">
              <div className="absolute transition-all duration-200 rounded-xl sm:rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              <Link
                to="/dashboard/events/new"
                className="relative inline-flex items-center justify-center w-full h-full px-6 sm:px-8 py-3 text-sm sm:text-base font-normal text-white bg-black border border-transparent rounded-xl sm:rounded-full"
                role="button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Event
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-4 sm:mb-6 px-4">
              <p className="text-gray-400 text-sm sm:text-base">
                Showing {filteredEvents.length} event
                {filteredEvents.length !== 1 ? "s" : ""}
                {searchTerm && ` for "${searchTerm}"`}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="ml-2 text-cyan-400 hover:text-cyan-300 underline text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group block relative bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-md border border-gray-700/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-cyan-500/30 transition-all duration-300"
                >
                  {/* Banner Image */}
                  <div className="relative w-full aspect-[2.2/1] overflow-hidden">
                    {/* Active Status Badge */}
                    {event.status === "published" && (
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                        <span className="px-2 sm:px-3 py-1 text-xs font-semibold rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/10 shadow-sm backdrop-blur-md">
                          Active
                        </span>
                      </div>
                    )}
                    {event.bannerUrl ? (
                      <>
                        <img
                          src={event.bannerUrl}
                          alt={`${event.title} banner`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 flex items-center justify-center">
                        <div className="text-gray-500 text-sm sm:text-lg font-medium">
                          No Image
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
                      {event.title}
                    </h3>

                    <div className="space-y-2 sm:space-y-3">
                      {/* Date and Time Row - Mobile Stacked */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 text-gray-300">
                          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-cyan-500/20 rounded-full flex-shrink-0">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium">
                            {new Date(event.startsAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <WatchIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium">
                            {new Date(event.startsAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-gray-300">
                        <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-orange-500/20 rounded-full flex-shrink-0">
                          <LocateIcon className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium truncate flex-1">
                          {event.venue || "Venue TBA"}
                        </span>
                      </div>

                      {/* Tickets Sold */}
                      <div className="flex justify-between pt-2 border-t border-gray-700/50">
                        <span className="text-gray-400 text-xs sm:text-sm">
                          Tickets Sold
                        </span>
                        <span className="text-white text-xs sm:text-sm font-medium">
                          {event.salesCount}/{event.capacity}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons - Mobile Optimized */}
                    <div className="flex gap-2 mt-3 sm:mt-4">
                      <Button
                        size="sm"
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-4 text-white rounded-md cursor-pointer"
                        onClick={() =>
                          setActiveSection("attendee-management", event.id)
                        }
                      >
                        <span className="hidden sm:inline">Manage Event</span>
                        <span className="sm:hidden">Manage</span>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white p-2 sm:p-2.5"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-sm">
                          <DropdownMenuItem className="text-white hover:bg-gray-700">
                            Edit Event
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-gray-700">
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-gray-700">
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
