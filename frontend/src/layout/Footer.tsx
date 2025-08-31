import { Twitter, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
   <footer className="bg-gradient-to-br from-black via-slate-950 to-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-12 mb-12">
          
          {/* Hero Section - Takes more space on desktop */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl leading-tight bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
                Seamless Web3 events
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl">and payments</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-md lg:max-w-lg leading-relaxed">
                Create, manage, and monetize your events with blockchain technology. 
                Join the future of event management.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative inline-flex items-center justify-center group">
                <div className="absolute transition-all duration-300 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:from-cyan-400 group-hover:to-purple-400"></div>
                <Link
                  to="/dashboard/events/new"
                  className="relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-black border border-transparent rounded-full hover:scale-105 transform transition-all duration-200"
                  role="button"
                >
                  Start Your Event Today
                </Link>
              </div>
              
              <Link 
              to="/docs"
              className="px-6 py-3 text-base font-medium text-gray-300 border border-gray-600 rounded-full hover:border-cyan-400 hover:text-cyan-400 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-400/20">
                Learn More
              </Link>
            </div>
          </div>

          {/* Navigation Links - Compact on desktop */}
          <div className="lg:col-span-2">
            {/* Mobile: Simple vertical stack with sections */}
            <div className="block lg:hidden space-y-8">
              {/* Important Links Section */}
              <div className="bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  Essential Links
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-200 text-sm">
                      About Us
                    </a>
                    <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-200 text-sm">
                      Features
                    </a>
                    <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-200 text-sm">
                      Dashboard
                    </a>
                  </div>
                  <div className="space-y-3">
                    <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-200 text-sm">
                      Pricing
                    </a>
                    <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-200 text-sm">
                      Tools
                    </a>
                    <a href="#" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-200 text-sm">
                      Support
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Access Pills */}
              <div>
                <h4 className="text-sm text-gray-400 mb-3 uppercase tracking-wide">Quick Access</h4>
                <div className="flex flex-wrap gap-2">
                  <a href="#" className="inline-flex items-center px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-xs text-gray-300 hover:border-purple-400/50 hover:text-purple-300 transition-all duration-200">
                    Newsletter
                  </a>
                  <a href="#" className="inline-flex items-center px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-xs text-gray-300 hover:border-purple-400/50 hover:text-purple-300 transition-all duration-200">
                    FAQ
                  </a>
                  <a href="#" className="inline-flex items-center px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-xs text-gray-300 hover:border-purple-400/50 hover:text-purple-300 transition-all duration-200">
                    Contact
                  </a>
                  <a href="#" className="inline-flex items-center px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-xs text-gray-300 hover:border-blue-400/50 hover:text-blue-300 transition-all duration-200">
                    Terms
                  </a>
                  <a href="#" className="inline-flex items-center px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-xs text-gray-300 hover:border-blue-400/50 hover:text-blue-300 transition-all duration-200">
                    Privacy
                  </a>
                  <a href="#" className="inline-flex items-center px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-full text-xs text-gray-300 hover:border-blue-400/50 hover:text-blue-300 transition-all duration-200">
                    Guides
                  </a>
                </div>
              </div>
            </div>

            {/* Desktop Grid Layout */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              {/* Platform Column */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-cyan-300 uppercase tracking-wider">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">About</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Features</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Pricing & Plans</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Contact</a></li>
                </ul>
              </div>

              {/* Resources Column */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-purple-300 uppercase tracking-wider">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Dashboard</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Tools</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Newsletter</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">FAQ</a></li>
                </ul>
              </div>

              {/* Legal Column */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-blue-300 uppercase tracking-wider">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Guides</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Terms & Conditions</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">Licensing</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Social Links */}
        <div className="border-t border-gradient-to-r from-transparent via-gray-700 to-transparent pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            
            {/* Left side - Social + Follow text */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <p className="text-gray-400 text-sm font-medium">Connect with us</p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="group relative"
                  aria-label="Twitter"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
                  <Twitter className="relative w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                </a>
                <a
                  href="#"
                  className="group relative"
                  aria-label="Facebook"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
                  <Facebook className="relative w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                </a>
                <a
                  href="#"
                  className="group relative"
                  aria-label="Instagram"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
                  <Instagram className="relative w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                </a>
              </div>
            </div>

            {/* Right side - Copyright */}
            <div className="text-xs text-gray-500">
              <p>© 2025 Web3 Events. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Removed <style jsx> block, not supported in Vite/React. Use global CSS or Tailwind utilities instead. */}
    </footer>
  );
}