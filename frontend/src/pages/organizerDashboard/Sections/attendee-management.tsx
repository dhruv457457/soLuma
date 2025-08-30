"use client";

import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Badge } from "../../../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Checkbox } from "../../../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu";
import { getOrganizerEvents, subscribeToOrganizerAttendees } from "../../../lib/dashboard";
import type { OrderDoc, EventDoc } from "../../../types/ticketing";
import { CheckSquare, EyeOffIcon, TimerOffIcon, User2Icon, Filter, X, Search, CheckCircle, ArrowLeft } from "lucide-react";

interface AttendeeManagementProps {
  setActiveSection: (section: string) => void;
  eventId: string | null;
}

export function AttendeeManagement({ setActiveSection, eventId: propEventId }: AttendeeManagementProps) {
  const params = useParams();
  const navigate = useNavigate();
  const urlEventId = params.eventId || null;
  // Use the eventId from URL params if available, otherwise fall back to props
  const eventId = urlEventId || propEventId;
  const { accounts } = useSolanaWallet();
  const organizerWallet = accounts?.[0] || "";
  const isConnected = !!organizerWallet;

  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  
  const [attendees, setAttendees] = useState<OrderDoc[]>([]);
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Map event IDs to event titles for display
  const eventTitleMap = new Map(events.map(e => [e.id, e.title]));

  useEffect(() => {
    if (!isConnected || !organizerWallet) {
      setDataLoading(false);
      return;
    }

    let unsubscribe: () => void = () => {};

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const fetchedEvents = await getOrganizerEvents(organizerWallet);
        setEvents(fetchedEvents as EventDoc[]);

        const eventIdsToSubscribe = eventId ? [eventId] : fetchedEvents.map(e => e.id);
        
        unsubscribe = subscribeToOrganizerAttendees(eventIdsToSubscribe, (fetchedAttendees) => {
          setAttendees(fetchedAttendees);
          setDataLoading(false);
        });
      } catch (e) {
        console.error("Failed to fetch attendee data:", e);
        setDataLoading(false);
      }
    };

    fetchData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isConnected, organizerWallet, eventId]);

  const handleCheckboxChange = (attendeeId: string) => {
    setSelectedAttendees(prev => 
      prev.includes(attendeeId)
        ? prev.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "checked-in":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "not-checked-in":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "no-show":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const attendeesForEvent = attendees.filter(a => eventId ? a.eventId === eventId : true);

  const filteredAttendees = attendeesForEvent.filter((attendee) => {
    if (!attendee || !attendee.buyerWallet) {
      return false;
    }
    const matchesSearch = attendee.buyerWallet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = eventFilter === "all" || attendee.eventId === eventFilter;
    const matchesStatus = statusFilter === "all" || (attendee.checkInStatus || "not-checked-in") === statusFilter;
    return matchesSearch && matchesEvent && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAttendees(filteredAttendees.map((a) => a.id));
    } else {
      setSelectedAttendees([]);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setEventFilter("all");
    setStatusFilter("all");
  };

  const activeFiltersCount = [eventFilter, statusFilter].filter(filter => filter !== "all").length + (searchTerm ? 1 : 0);

  const handleBack = () => {
    // If we're in a specific event context, go back to events list
    if (eventId) {
      setActiveSection("my-events");
    } else {
      // If we're in general attendee management, go back to dashboard
      navigate(-1);
    }
  };
  
  const attendeeStats = {
    total: attendeesForEvent.length,
    checkedIn: attendeesForEvent.filter((a) => a.checkInStatus === "checked-in").length,
    notCheckedIn: attendeesForEvent.filter((a) => a.checkInStatus === "not-checked-in" || !a.checkInStatus).length,
    noShow: attendeesForEvent.filter((a) => a.checkInStatus === "no-show").length,
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-400 p-4 text-center flex items-center justify-center">
        <div className="flex items-center gap-3 text-base sm:text-lg">
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          Loading attendees...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white sm:p-2 lg:p-4 relative">
      <div className="max-w-7xl mx-auto py-4 sm:py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 px-2 sm:px-0">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          {/* Header Title */}
          <div className="flex-1 text-center">
            <h2 className="text-3xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
              Attendee Management
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
              Manage your event attendees and track check-ins.
            </p>
          </div>
          
          {/* Spacer to balance the layout */}
          <div className="w-[88px]"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 px-2 sm:px-0">
          <Card className="bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-md border border-gray-700/40 hover:border-cyan-500/30 transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total Attendees</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{attendeeStats.total}</p>
                </div>
                <div className="p-2 rounded-full bg-blue-500/20">
                  <User2Icon className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-md border border-gray-700/40 hover:border-green-500/30 transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Checked In</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-400">{attendeeStats.checkedIn}</p>
                </div>
                <div className="p-2 rounded-full bg-green-500/20">
                  <CheckSquare className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-md border border-gray-700/40 hover:border-yellow-500/30 transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Pending</p>
                  <p className="text-lg sm:text-2xl font-bold text-yellow-400">{attendeeStats.notCheckedIn}</p>
                </div>
                <div className="p-2 rounded-full bg-yellow-500/20">
                  <TimerOffIcon className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-md border border-gray-700/40 hover:border-red-500/30 transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">No Show</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-400">{attendeeStats.noShow}</p>
                </div>
                <div className="p-2 rounded-full bg-red-500/20">
                  <EyeOffIcon className="w-5 h-5 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Search Input with Filter Button */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by wallet address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-14 sm:pr-16 py-3 sm:py-4 bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl sm:rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm sm:text-base"
              />
              {/* Filter Button */}
              <button
                onClick={() => setFilterSidebarOpen(true)}
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

            {/* QR Scanner Button */}
            <div className="relative hidden sm:block">
              <div className="absolute transition-all duration-200 rounded-xl sm:rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              <Link
                to="/dashboard/scanner"
                className="relative inline-flex items-center justify-center px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm lg:text-base font-normal text-white bg-black border border-transparent rounded-xl sm:rounded-full whitespace-nowrap"
                role="button"
              >
                QR Code Scanner
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Sidebar */}
        <div className={`fixed inset-0 z-50 ${filterSidebarOpen ? 'visible' : 'invisible'}`}>
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              filterSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setFilterSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl transform transition-transform duration-300 ease-out ${
              filterSidebarOpen ? 'translate-x-0' : 'translate-x-full'
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
                  onClick={() => setFilterSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Event Filter */}
                {!eventId && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                      Event
                    </h4>
                    <div className="space-y-2">
                      {[
                        { value: "all", label: "All Events" },
                        ...events.map((event) => ({
                          value: event.id,
                          label: event.title
                        }))
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setEventFilter(option.value)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                            eventFilter === option.value
                              ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                              : "bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {option.label}
                          </span>
                          {eventFilter === option.value && (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Status Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Check-in Status
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Status" },
                      { value: "checked-in", label: "Checked In" },
                      { value: "not-checked-in", label: "Not Checked In" },
                      { value: "no-show", label: "No Show" },
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
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-gray-700/50 space-y-3">
                <button
                  onClick={clearFilters}
                  disabled={activeFiltersCount === 0}
                  className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setFilterSidebarOpen(false)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Attendees Table */}
        {filteredAttendees.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] w-full px-4">
            <div className="mb-4 sm:mb-6 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                <User2Icon className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400" />
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
              {searchTerm || activeFiltersCount > 0
                ? "No Attendees Found"
                : "No Attendees"}
            </h3>
            <p className="text-gray-400 mb-6 sm:mb-8 text-center text-sm sm:text-base max-w-sm">
              {searchTerm || activeFiltersCount > 0
                ? "Try adjusting your search or filter criteria."
                : "No attendees have registered for this event yet."}
            </p>
            {(searchTerm || activeFiltersCount > 0) && (
              <button
                onClick={clearFilters}
                className="mb-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-4 sm:mb-6 px-4">
              <p className="text-gray-400 text-sm sm:text-base">
                Showing {filteredAttendees.length} attendee
                {filteredAttendees.length !== 1 ? "s" : ""}
                {searchTerm && ` for "${searchTerm}"`}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="ml-2 text-cyan-400 hover:text-cyan-300 underline text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </p>
            </div>
            
            <Card className="bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-md border border-gray-700/40 mx-2 sm:mx-0">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-lg sm:text-xl text-white">Attendees List</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-400">
                      {filteredAttendees.length} of {attendeesForEvent.length} attendees
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4">
                          <Checkbox
                            checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                            onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                          />
                        </th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium">Attendee Wallet</th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium hidden md:table-cell">Event</th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium hidden lg:table-cell">Purchase Date</th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendees.map((attendee) => (
                        <tr key={attendee.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors duration-200">
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <Checkbox
                              checked={selectedAttendees.includes(attendee.id)}
                              onCheckedChange={() => handleCheckboxChange(attendee.id)}
                            />
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 font-mono text-xs sm:text-sm text-gray-300 max-w-[120px] sm:max-w-[200px] truncate">
                            {attendee.buyerWallet}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-white max-w-[100px] sm:max-w-[150px] truncate hidden md:table-cell">
                            {eventTitleMap.get(attendee.eventId) || 'Unknown Event'}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4 text-white hidden lg:table-cell">
                            {new Date(attendee.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <div className="space-y-1">
                              <Badge className={`text-xs ${getStatusColor(attendee.checkInStatus || "not-checked-in")}`}> 
                                {attendee.checkInStatus === "checked-in" ? "Checked In"
                                 : attendee.checkInStatus === "no-show" ? "No Show"
                                 : "Not Checked In"}
                              </Badge>
                              {attendee.checkInTime && (
                                <p className="text-xs text-gray-400">
                                  {new Date(attendee.checkInTime).toLocaleTimeString()}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 px-2 sm:px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700/50 h-8 w-8 p-0">
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                                <DropdownMenuItem className="text-white hover:bg-gray-700">View Details</DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-gray-700">
                                  {attendee.checkInStatus === "checked-in" ? "Undo Check-in" : "Check In"}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">Remove</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}