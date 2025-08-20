import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listPublishedEvents } from "../lib/events";
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
    <Link 
      to={`/e/${ev.id}`} 
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

    // Cleanup on unmount
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
      // Tab filter (past/upcoming)
      const eventDate = new Date(event.startsAt);
      const isUpcoming = eventDate >= now;
      
      if (activeTab === 'upcoming' && !isUpcoming) return false;
      if (activeTab === 'past' && isUpcoming) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesVenue = event.venue?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesVenue) return false;
      }

      // Venue filter
      if (filters.venue && !event.venue?.toLowerCase().includes(filters.venue.toLowerCase())) {
        return false;
      }

      // Currency filter
      if (filters.currency !== 'all' && event.currency !== filters.currency) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const price = event.priceLamports / (event.currency === 'SOL' ? 1e9 : 1e6);
        switch (filters.priceRange) {
          case 'free':
            if (price > 0) return false;
            break;
          case 'low':
            if (price > 50) return false;
            break;
          case 'medium':
            if (price < 50 || price > 200) return false;
            break;
          case 'high':
            if (price < 200) return false;
            break;
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
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Discover Events
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Find amazing events happening around you
          </p>
        </div>

        {/* Search Bar with Enhanced Professional Toggle */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
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
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    showFilters 
                      ? 'bg-blue-500/20 text-blue-400 scale-110' 
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Professional Enhanced Toggle */}
            <div className="relative bg-slate-800/90 backdrop-blur-md border border-slate-700/60 rounded-2xl p-1.5 shadow-2xl flex-shrink-0 min-w-fit">
              {/* Animated Background Slider */}
              <div 
                className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl transition-all duration-500 ease-out shadow-lg border border-slate-600/50"
                style={{
                  left: activeTab === 'upcoming' ? '6px' : '50%',
                  right: activeTab === 'upcoming' ? '50%' : '6px',
                }}
              />
              
              
              {/* Tab Buttons */}
              <div className="relative flex">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-500 relative z-10 whitespace-nowrap ${
                    activeTab === 'upcoming' 
                      ? 'text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`px-8 py-3.5 text-sm font-semibold rounded-xl transition-all duration-500 relative z-10 whitespace-nowrap ${
                    activeTab === 'past' 
                      ? 'text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  Past
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Smooth Filter Sidebar */}
        <div className={`fixed inset-0 z-50 transition-all duration-500 ease-out ${
          showFilters 
            ? 'opacity-100 visibility-visible' 
            : 'opacity-0 visibility-hidden pointer-events-none'
        }`}>
          {/* Enhanced Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-500 ease-out ${
              showFilters ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setShowFilters(false)}
          />
          
          {/* Smooth Sliding Sidebar */}
          <div className={`absolute right-0 top-0 bottom-0 w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl transform transition-all duration-500 ease-out ${
            showFilters 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-full opacity-0'
          }`}>
            <div className="h-full overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                  <h3 className="text-xl font-semibold text-white">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 rounded-lg transition-all duration-300 hover:rotate-90"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Clear All Button */}
                <button
                  onClick={() => {
                    setFilters({ venue: '', priceRange: 'all', currency: 'all' });
                    setSearchQuery('');
                  }}
                  className="w-full py-3 px-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  Clear All Filters
                </button>
                
                {/* Filter Options */}
                <div className="space-y-6">
                  {/* Venue Filter */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">Venue</label>
                    <input
                      type="text"
                      placeholder="Filter by venue..."
                      value={filters.venue}
                      onChange={(e) => setFilters({ ...filters, venue: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    />
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">Price Range</label>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'All Prices' },
                        { value: 'free', label: 'Free Events' },
                        { value: 'low', label: 'Under $50' },
                        { value: 'medium', label: '$50 - $200' },
                        { value: 'high', label: 'Over $200' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="priceRange"
                            value={option.value}
                            checked={filters.priceRange === option.value}
                            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                            className="w-4 h-4 text-blue-500 bg-slate-800 border-slate-700 focus:ring-blue-500/50"
                          />
                          <span className="text-slate-300 group-hover:text-white transition-colors duration-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Currency Filter */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">Currency</label>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'All Currencies' },
                        { value: 'SOL', label: 'SOL' },
                        { value: 'USDC', label: 'USDC' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="currency"
                            value={option.value}
                            checked={filters.currency === option.value}
                            onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
                            className="w-4 h-4 text-blue-500 bg-slate-800 border-slate-700 focus:ring-blue-500/50"
                          />
                          <span className="text-slate-300 group-hover:text-white transition-colors duration-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {(searchQuery || filters.venue || filters.priceRange !== 'all' || filters.currency !== 'all') && (
                    <div className="space-y-3 pt-4 border-t border-slate-700/50">
                      <h4 className="text-sm font-medium text-slate-300">Active Filters</h4>
                      <div className="space-y-2">
                        {searchQuery && (
                          <div className="flex items-center justify-between bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-2">
                            <span className="text-blue-300 text-sm">Search: "{searchQuery}"</span>
                            <button
                              onClick={() => setSearchQuery('')}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        {filters.venue && (
                          <div className="flex items-center justify-between bg-orange-500/20 border border-orange-500/30 rounded-lg px-3 py-2">
                            <span className="text-orange-300 text-sm">Venue: "{filters.venue}"</span>
                            <button
                              onClick={() => setFilters({ ...filters, venue: '' })}
                              className="text-orange-400 hover:text-orange-300 transition-colors duration-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        {filters.priceRange !== 'all' && (
                          <div className="flex items-center justify-between bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-2">
                            <span className="text-green-300 text-sm">
                              Price: {filters.priceRange === 'free' ? 'Free' : 
                                     filters.priceRange === 'low' ? 'Under $50' :
                                     filters.priceRange === 'medium' ? '$50-$200' : 'Over $200'}
                            </span>
                            <button
                              onClick={() => setFilters({ ...filters, priceRange: 'all' })}
                              className="text-green-400 hover:text-green-300 transition-colors duration-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        {filters.currency !== 'all' && (
                          <div className="flex items-center justify-between bg-purple-500/20 border border-purple-500/30 rounded-lg px-3 py-2">
                            <span className="text-purple-300 text-sm">Currency: {filters.currency}</span>
                            <button
                              onClick={() => setFilters({ ...filters, currency: 'all' })}
                              className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Display */}
        {filteredEvents?.length === 0 ? (
          <div className="max-w-md mx-auto">
            <div className="p-8 text-center bg-gradient-to-br from-gray-900/60 to-gray-950/80 backdrop-blur-md border border-gray-700/40 rounded-3xl shadow-xl">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery || filters.venue || filters.priceRange !== 'all' || filters.currency !== 'all' 
                  ? 'No Events Found' 
                  : `No ${activeTab} Events`}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || filters.venue || filters.priceRange !== 'all' || filters.currency !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : `No ${activeTab} events available right now.`}
              </p>
              {!searchQuery && filters.venue === '' && filters.priceRange === 'all' && filters.currency === 'all' && activeTab === 'upcoming' && (
                <Link 
                  to="/create-event" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Create Event
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
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