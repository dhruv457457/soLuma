// src/pages/organizerDashboard/Sections/attendee-management.tsx

"use client";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { CheckSquare, EyeOffIcon, TimerOffIcon, User2Icon } from "lucide-react";

interface AttendeeManagementProps {
  setActiveSection: (section: string) => void;
  eventId: string | null;
}

export function AttendeeManagement({ setActiveSection, eventId: propEventId }: AttendeeManagementProps) {
  const params = useParams();
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
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
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

  // Set default view mode based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('cards');
      } else {
        setViewMode('table');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  
  const attendeeStats = {
    total: attendeesForEvent.length,
    checkedIn: attendeesForEvent.filter((a) => a.checkInStatus === "checked-in").length,
    notCheckedIn: attendeesForEvent.filter((a) => a.checkInStatus === "not-checked-in" || !a.checkInStatus).length,
    noShow: attendeesForEvent.filter((a) => a.checkInStatus === "no-show").length,
  };

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
        <p>Loading attendees...</p>
      </div>
    );
  }

  const AttendeeCard = ({ attendee }: { attendee: OrderDoc }) => (
    <Card key={attendee.id} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Checkbox
            checked={selectedAttendees.includes(attendee.id)}
            onCheckedChange={() => handleCheckboxChange(attendee.id)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-8 w-8 p-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Attendee Wallet</p>
            <p className="font-mono text-sm text-gray-300 break-all">{attendee.buyerWallet}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 mb-1">Event</p>
            <p className="text-sm text-white">{eventTitleMap.get(attendee.eventId) || 'Unknown Event'}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 mb-1">Purchase Date</p>
            <p className="text-sm text-white">{new Date(attendee.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 mb-1">Check-in Status</p>
            <div className="space-y-1">
              <Badge className={getStatusColor(attendee.checkInStatus || "not-checked-in")}> 
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
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-black text-white p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Attendee Management
          </h1>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage your event attendees and track check-ins.
          </p>
        </div>
        <div className="relative group w-full sm:w-auto">
  <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-blue-500"></div>
  
  <Link
    to="/dashboard/scanner"
    className="cursor-pointer relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-black border border-transparent rounded-full w-full sm:w-auto"
    role="button"
  >
    QR Code Scanner
  </Link>
</div>

      </div>
      
      <hr className="border-gray-800" />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{attendeeStats.total}</p>
              </div>
              <User2Icon></User2Icon>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Checked In</p>
                <p className="text-lg sm:text-2xl font-bold text-green-400">{attendeeStats.checkedIn}</p>
              </div>
              <CheckSquare></CheckSquare>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-400">{attendeeStats.notCheckedIn}</p>
              </div>
              <TimerOffIcon></TimerOffIcon>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">No Show</p>
                <p className="text-lg sm:text-2xl font-bold text-red-400">{attendeeStats.noShow}</p>
              </div>
              <EyeOffIcon></EyeOffIcon>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <hr className="border-gray-800" />

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by wallet address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
          />
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!eventId && (
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Events</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="not-checked-in">Not Checked In</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
            </SelectContent>
          </Select>
          
          {/* View Toggle for larger screens */}
          <div className="hidden md:flex bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>
      
      <hr className="border-gray-800" />

      {/* Attendees List */}
      {viewMode === 'cards' || window.innerWidth < 768 ? (
        /* Card View - Mobile optimized */
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Attendees List</h2>
            <Checkbox
              checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
              onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
            />
          </div>
          
          <div className="space-y-3">
            {filteredAttendees.map((attendee) => (
              <AttendeeCard key={attendee.id} attendee={attendee} />
            ))}
          </div>
        </div>
      ) : (
        /* Table View - Desktop */
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Attendees List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">
                      <Checkbox
                        checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                        onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Attendee Wallet</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Event</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Purchase Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Check-in Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendees.map((attendee) => (
                    <tr key={attendee.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-4 px-4">
                        <Checkbox
                          checked={selectedAttendees.includes(attendee.id)}
                          onCheckedChange={() => handleCheckboxChange(attendee.id)}
                        />
                      </td>
                      <td className="py-4 px-4 font-mono text-sm text-gray-300 max-w-[200px] truncate">
                        {attendee.buyerWallet}
                      </td>
                      <td className="py-4 px-4 text-white max-w-[150px] truncate">
                        {eventTitleMap.get(attendee.eventId) || 'Unknown Event'}
                      </td>
                      <td className="py-4 px-4 text-white">
                        {new Date(attendee.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <Badge className={getStatusColor(attendee.checkInStatus || "not-checked-in")}> 
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
                      <td className="py-4 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
      )}

      {/* Empty State */}
      {filteredAttendees.length === 0 && (
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="text-4xl sm:text-6xl mb-4">👥</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No attendees found</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              {searchTerm || eventFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No attendees have registered for this event yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}