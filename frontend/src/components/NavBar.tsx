import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";

type NavItem = {
  label: string;
  to: string;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/events" },
  { label: "Create Event", to: "/org/events" },
  { label: "My Tickets", to: "/tickets" },
  { label: "Scanner", to: "/scan" },
];

function navClasses(isActive: boolean) {
  return [
    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
    isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:text-blue-700 hover:bg-gray-100",
  ].join(" ");
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="inline-block h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400" />
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-gray-900">Solu</span>
                <span className="text-blue-700">ma</span>
              </span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navItems.map(({ label, to }) => (
              <NavLink key={to} to={to} className={({ isActive }) => navClasses(isActive)}>
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              ref={btnRef}
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {open ? (
                // X icon
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        <div
          ref={panelRef}
          className={`md:hidden overflow-hidden transition-[max-height] duration-200 ${
            open ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="border-t border-gray-200 py-2">
            {navItems.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "block px-3 py-2 rounded-md text-base font-medium",
                    isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-blue-700",
                  ].join(" ")
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
