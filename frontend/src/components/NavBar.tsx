import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-700">
              PayPact
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                }`}
              >
                Home
              </Link>
              <Link
                to="/create"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/create")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                }`}
              >
                Create Pact
              </Link>
              <Link
                to="/organizer"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/organizer")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                }`}
              >
                Dashboard
              </Link> 
              <Link
                to="/my"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/my")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                }`}
              >
                My Pacts
              </Link>
                
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-gray-600 hover:text-blue-700 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/create"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/create")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Create Pact
              </Link>
              <Link
                to="/organizer"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/organizer")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/my"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/my")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Pacts
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
