import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listPublishedEvents } from "../../../lib/events";
import { Calendar, MapPin, DollarSign, Clock, Search, Filter, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

// The EventRow component now has enhanced styling and better visual hierarchy
function EventRow({ ev }: { ev: any }) {
  const priceDisplay = ev.currency === "SOL"
    ? `${(ev.priceLamports / 1e9).toFixed(4)} SOL`
    : `${(ev.priceLamports / 1e6).toFixed(2)} USDC`;

  const eventDate = new Date(ev.startsAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const eventTime = new Date(ev.startsAt).toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    // FIX #1: Updated the link to the correct event details route
    <Link 
      to={`/dashboard/events/${ev.id}`} 
      className="group block relative bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-md border border-gray-700/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-gray-600/60 transition-all duration-300"
    >
      {/* Event Image with Overlay */}
      <div className="relative w-full aspect-[2.2/1] overflow-hidden">
        {ev.bannerUrl ? (
          <>
            <img
              src={ev.bannerUrl}
              alt={`${ev.title} banner`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 flex items-center justify-center">
            <div className="text-gray-500 text-lg font-medium">No Image</div>
          </div>
        )}
      </div>

      {/* Card Content with Enhanced Layout */}
      <div className="p-6 space-y-4">
        {/* Title with better typography */}
        <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
          {ev.title}
        </h3>
        
        {/* Enhanced Metadata Grid */}
        <div className="space-y-3">
          {/* Date and Time Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-300">
              <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/20 rounded-full">
                <Calendar className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-sm font-medium">{eventDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">{eventTime}</span>
            </div>
          </div>

          {/* Location Row */}
          <div className="flex items-center gap-2 text-gray-300">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-500/20 rounded-full">
              <MapPin className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-sm font-medium truncate flex-1">
              {ev.venue || "Venue TBA"}
            </span>
          </div>

          {/* Price Row with Enhanced Styling */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm text-gray-400">Price</span>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-3 py-1 rounded-full border border-green-500/30">
              <span className="text-green-300 font-bold text-sm">{priceDisplay}</span>
            </div>
          </div>
        </div>

        {/* Hover Indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
      </div>
    </Link>
  );
}

export default function EventsList() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    venue: '',
    priceRange: 'all', // all, free, low, medium, high
    currency: 'all', // all, SOL, USDC
  });

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilters]);

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ["events", "published"],
    queryFn: listPublishedEvents,
  });

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const now = new Date();
    
    return events.filter(event => {
      const eventDate = new Date(event.startsAt);
      const isUpcoming = eventDate >= now;
      
      if (activeTab === 'upcoming' && !isUpcoming) return false;
      if (activeTab === 'past' && isUpcoming) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesVenue = event.venue?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesVenue) return false;
      }

      if (filters.venue && !event.venue?.toLowerCase().includes(filters.venue.toLowerCase())) {
        return false;
      }

      if (filters.currency !== 'all' && event.currency !== filters.currency) {
        return false;
      }

      if (filters.priceRange !== 'all') {
        const price = event.priceLamports / (event.currency === 'SOL' ? 1e9 : 1e6);
        switch (filters.priceRange) {
          case 'free': if (price > 0) return false; break;
          case 'low': if (price === 0 || price > 50) return false; break;
          case 'medium': if (price < 50 || price > 200) return false; break;
          case 'high': if (price < 200) return false; break;
        }
      }

      return true;
    });
  }, [events, activeTab, searchQuery, filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-400 p-8 text-center flex items-center justify-center">
        <div className="flex items-center gap-4 text-lg">
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          Loading events...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black text-center p-8 flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          Failed to load events.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-1 lg:p-2">
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Discover Events
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Find amazing on-chain events hosted by the community.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events by title or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-all duration-300 ${ showFilters ? 'bg-blue-500/20 text-blue-400 scale-110' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50' }`}
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="relative bg-slate-800/90 backdrop-blur-md border border-slate-700/60 rounded-2xl p-1.5 shadow-2xl flex-shrink-0 min-w-fit hidden sm:block ">
              <div 
                className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl transition-all duration-500 ease-out shadow-lg border border-slate-600/50 "
                style={{
                  left: activeTab === 'upcoming' ? '6px' : '50%',
                  right: activeTab === 'upcoming' ? '50%' : '6px',
                }}
              />
              <div className="relative flex">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-500 relative z-10 whitespace-nowrap ${ activeTab === 'upcoming' ? 'text-white shadow-sm' : 'text-slate-400 hover:text-slate-300' }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-500 relative z-10 whitespace-nowrap ${ activeTab === 'past' ? 'text-white shadow-sm' : 'text-slate-400 hover:text-slate-300' }`}
                >
                  Past
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Sidebar */}
        <div className={`fixed inset-0 z-50 transition-all duration-500 ease-out ${ showFilters ? 'opacity-100 visibility-visible' : 'opacity-0 visibility-hidden pointer-events-none' }`}>
          <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 ease-out ${ showFilters ? 'opacity-100' : 'opacity-0' }`} onClick={() => setShowFilters(false)} />
          <div className={`absolute right-0 top-0 bottom-0 w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl transform transition-all duration-500 ease-out ${ showFilters ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0' }`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-semibold text-white">Filters</h3>
                  {((filters.venue !== '') || (filters.priceRange !== 'all') || (filters.currency !== 'all') || searchQuery) && (
                    <div className="w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {[filters.venue !== '', filters.priceRange !== 'all', filters.currency !== 'all', searchQuery].filter(Boolean).length}
                      </span>
                    </div>
                  )}
                </div>
                <button onClick={() => setShowFilters(false)} className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 rounded-lg transition-all duration-300">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Venue Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Venue
                  </h4>
                  <input
                    type="text"
                    placeholder="Search by venue..."
                    value={filters.venue}
                    onChange={(e) => setFilters({ ...filters, venue: e.target.value })}
                    className="w-full p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                  />
                </div>

                {/* Currency Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Currency
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Currencies" },
                      { value: "SOL", label: "SOL" },
                      { value: "USDC", label: "USDC" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilters({ ...filters, currency: option.value })}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                          filters.currency === option.value
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                            : "bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-800 hover:border-slate-600"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        {filters.currency === option.value && (
                          <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Prices" },
                      { value: "free", label: "Free Events" },
                      { value: "low", label: "Low Price ($0 - $50)" },
                      { value: "medium", label: "Medium Price ($50 - $200)" },
                      { value: "high", label: "High Price ($200+)" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilters({ ...filters, priceRange: option.value })}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                          filters.priceRange === option.value
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400"
                            : "bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-800 hover:border-slate-600"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                        {filters.priceRange === option.value && (
                          <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-700/50 space-y-3">
                <button
                  onClick={() => { setFilters({ venue: '', priceRange: 'all', currency: 'all' }); setSearchQuery(''); }}
                  disabled={!((filters.venue !== '') || (filters.priceRange !== 'all') || (filters.currency !== 'all') || searchQuery)}
                  className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-gray-500 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents?.length === 0 ? (
          <div className="max-w-md mx-auto pt-8">
            <div className="p-8 text-center bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-md border border-gray-700/40 rounded-3xl shadow-xl">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery || filters.venue || filters.priceRange !== 'all' || filters.currency !== 'all' ? 'No Events Found' : `No ${activeTab} Events`}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || filters.venue || filters.priceRange !== 'all' || filters.currency !== 'all' ? 'Try adjusting your search or filters' : `No ${activeTab} events available right now.`}
              </p>
              {/* FIX #2: Updated the link to the correct "Create Event" route */}
              <Link 
                to="/dashboard/events/new" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Create an Event
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-gray-400">
                Showing {filteredEvents?.length} {activeTab} event{filteredEvents?.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {filteredEvents?.map((ev) => <EventRow key={ev.id} ev={ev} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}