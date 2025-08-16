import { Twitter, Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
   <footer className="bg-gradient-to-br from-black via-slate-950 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 via-transparent to-transparent"></div>
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8 lg:mb-12">
          {/* Left Section */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal leading-relaxed">
              Seamless Web3 events
              <br />
              and payments
            </h2>
            <div className="relative inline-flex items-center justify-center group">
              <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 "></div>
              <a
                href="/org/events"
                className="relative inline-flex items-center justify-center px-6 py-2 text-base font-normal text-white bg-black border border-transparent rounded-full"
                role="button"
              >
                Start Your Event Today
              </a>
            </div>
          </div>

          {/* Right Section - Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Platform Column */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-white">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Pricing & Plans
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Tools
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Newsletter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Licensing
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Social Links */}
        <div className="border-t border-gray-800 pt-6 lg:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">Follow us on:</p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
