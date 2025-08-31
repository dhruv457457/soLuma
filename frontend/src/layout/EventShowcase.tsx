import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export function EventsShowcase() {
  const events = [
    {
      id: 1,
      title: "Solana Developer Conference 2024",
      date: "Dec 15, 2024",
      location: "San Francisco, CA",
      attendees: 1200,
      image: "/First.jpg",
      size: "large",
      status: "completed",
    },
    {
      id: 2,
      title: "Web3 Startup Pitch Night",
      date: "Nov 28, 2024",
      location: "Austin, TX",
      attendees: 350,
      image: "/blockchain.jpg",
      size: "medium",
      status: "completed",
    },
    {
      id: 3,
      title: "DeFi Workshop Series",
      date: "Nov 20, 2024",
      location: "Online",
      attendees: 800,
      image: "/second.jpg",
      size: "medium",
      status: "completed",
    },
    {
      id: 4,
      title: "NFT Art Gallery Opening",
      date: "Nov 10, 2024",
      location: "Miami, FL",
      attendees: 150,
      image: "/Web3.png",
      size: "small",
      status: "completed",
    },
    {
      id: 5,
      title: "Blockchain Gaming Summit",
      date: "Oct 25, 2024",
      location: "Los Angeles, CA",
      attendees: 600,
      image: "/gaming.avif",
      size: "medium",
      status: "completed",
    },
  ];

  return (
    <section className="relative py-20 px-6 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Events Powered by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Soluma
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            From intimate workshops to global conferences, creators trust
            Soluma for seamless, secure, and decentralized event management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]">
          {events.map((event) => (
            <div
              key={event.id}
              className={`group relative overflow-hidden rounded-2xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 ${
                event.size === "large"
                  ? "lg:col-span-2 lg:row-span-2 auto-rows-[516px]"
                  : "lg:col-span-1 lg:row-span-1"
              }`}
            >
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3
                  className={`font-semibold text-white transition-all duration-300 ${
                    event.size === "large" ? "text-2xl" : "text-lg"
                  }`}
                >
                  {event.title}
                </h3>
                <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-2 transition-all duration-500 ease-in-out">
                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>{event.attendees} Attendees</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="relative inline-flex items-center justify-center group">
            <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500"></div>
            <Link
              to="/dashboard/explore"
              className="relative inline-flex items-center justify-center px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full"
              role="button"
            >
              Explore All Events
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}