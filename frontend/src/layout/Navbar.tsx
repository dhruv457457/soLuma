"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../ui/resizable-navbar";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
} from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";

export function NavbarDemo() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const { status } = useWeb3Auth();
  const {
    connect,
    isConnected,
    loading: connectLoading,
  } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { accounts } = useSolanaWallet();
  const addressAvailable = accounts && accounts.length > 0;

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Create Pact", link: "/create" },
    { name: "Dashboard", link: "/dashboard/profile" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const WalletConnectButton = () => {
    const isLoading = status === 'connecting' || status === 'not_ready';
    
    if (isConnected) {
        return (
            <NavbarButton
              variant="primary"
              disabled={disconnectLoading}
              onClick={() => disconnect({ cleanup: true })}
            >
              {disconnectLoading ? "Disconnecting..." : "Log Out"}
            </NavbarButton>
        );
    }
    
    return (
        <NavbarButton
          variant="primary"
          disabled={isLoading || connectLoading}
          onClick={() => connect()}
        >
          {isLoading ? "Initializing..." : (connectLoading ? "Connecting..." : "Connect Wallet")}
        </NavbarButton>
    );
  };

  return (
    <div className="z-100 w-full fixed">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={navItems.map((item) => ({
              ...item,
              name: item.name,
              link: item.link,
            }))}
          />
          <div className="flex items-center gap-4">
            <WalletConnectButton />
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.link)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t my-2"></div>
            <div className="px-3 py-2">
              <WalletConnectButton />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}