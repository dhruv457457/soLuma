import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ComponentName: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="lg:pt-14 bg-black sm:pb-16 lg:pb-20 xl:pb-24">
        <div className="px-4 pt-2 mx-auto sm:px-6 lg:px-8 max-w-7xl mt-0">
          {/* Centered timestamp for small screens */}
          <div className="flex justify-center lg:hidden">
            <div className="text-gray-400 text-sm font-mono bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800 max-w-xs w-auto text-center">
              {formatTime(currentTime)}
            </div>
          </div>

          <div className="relative">
            <div className="lg:w-2/3">
              {/* Tagline - hidden only on mobile */}
              <p className="text-sm font-normal tracking-widest text-gray-300 uppercase hidden sm:block">
                The Future of Decentralized Events
              </p>

              {/* Heading */}
              <h1 className="mt-6 text-5xl font-bold text-white sm:mt-10 sm:text-5xl lg:text-6xl xl:text-7xl text-center lg:text-left">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">
                  Seamless Web3 Events
                </span>{" "}
                <br />& Payments
              </h1>

              {/* Description */}
              <p className="max-w-lg mt-4 text-2xl font-normal text-gray-400 sm:mt-8 text-center lg:text-left mx-auto lg:mx-0">
                Effortlessly create and manage events on the Solana blockchain
                with Soluma. Sell tickets, manage attendees, and receive
                payments directly to your wallet.
              </p>

              {/* CTA Button */}
              <div
                className="
    relative inline-flex items-center justify-center mt-8 sm:mt-12 group 
    lg:mx-0
    mx-auto
    sm:static 
    left-1/2 transform -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:fixed-none
  "
              >
                <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                <Link
                  to = "/dashboard/explore"
                  className="relative inline-flex items-center justify-center px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full"
                  role="button"
                >
                  Explore Events
                </Link>
              </div>

              {/* Join line - hidden on mobile */}
              <div className="hidden sm:block">
                <div className="inline-flex items-center pt-6 mt-8 border-t border-gray-800 sm:pt-10 sm:mt-14">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={1.5}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 7.00003H21M21 7.00003V15M21 7.00003L13 15L9 11L3 17"
                      stroke="url(#a)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id="a"
                        x1="3"
                        y1="7.00003"
                        x2="22.2956"
                        y2="12.0274"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="var(--color-cyan-500)" />
                        <stop
                          offset="100%"
                          stopColor="var(--color-purple-500)"
                        />
                      </linearGradient>
                    </defs>
                  </svg>

                  <span className="ml-2 text-base font-normal text-white">
                    Join thousands of users creating and attending events
                    on-chain.
                  </span>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="mt-8 md:absolute md:mt-0 md:top-32 lg:top-0 md:right-0">
              <img
                className="w-full max-w-xs mx-auto lg:max-w-lg xl:max-w-xl"
                src="https://landingfoliocom.imgix.net/store/collection/dusk/images/hero/1/3d-illustration.png"
                alt="Hero Illustration"
              />
            </div>

            {/* Join line - mobile only, positioned after image */}
            <div className="block sm:hidden mt-8">
              <div className="flex items-start justify-center pt-6 border-t border-gray-800">
                <svg
                  className="w-6 h-6 mr-2 mt-0.5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={1.5}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 7.00003H21M21 7.00003V15M21 7.00003L13 15L9 11L3 17"
                    stroke="url(#b)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="b"
                      x1="3"
                      y1="7.00003"
                      x2="22.2956"
                      y2="12.0274"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="var(--color-cyan-500)" />
                      <stop
                        offset="100%"
                        stopColor="var(--color-purple-500)"
                      />
                    </linearGradient>
                  </defs>
                </svg>

                <span className="text-base font-normal text-white text-center">
                  Join thousands of users creating and attending events
                  on-chain.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComponentName;