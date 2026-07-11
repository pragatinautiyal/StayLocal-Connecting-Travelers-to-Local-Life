import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/useTheme";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  let leftItems = [];
  let rightItems = [];

  if (!isAuthenticated) {
    leftItems = [
      { name: "Home", path: "/" },
      { name: "Explore", path: "/explore" },
    ];

    rightItems = [
      { name: "Login", path: "/login" },
      { name: "Register", path: "/register" },
    ];
  } else if (user.role === "traveller") {
    leftItems = [
      { name: "Home", path: "/" },
      { name: "Explore", path: "/explore" },
      { name: "Wishlist", path: "/wishlist" },
      { name: "My Trips", path: "/trips" },
    ];

    rightItems = [{ name: "Settings", path: "/settings" }];
  } else if (user.role === "host") {
    leftItems = [
      { name: "Home", path: "/" },
      { name: "Dashboard", path: "/dashboard" },
      { name: "My Listings", path: "/my-listings" },
    ];

    rightItems = [{ name: "Settings", path: "/settings" }];
  }

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-green-600 hover:scale-105 transition"
        >
          StayLocal
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Left links */}
          {leftItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-700 dark:text-slate-100 hover:text-green-600 transition"
            >
              {item.name}
            </Link>
          ))}

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 dark:bg-slate-600 mx-2"></div>

          {/* AI Planner */}
          {(!isAuthenticated || user.role === "traveller") && (
            <Link
              to="/ai"
              className="relative px-5 py-2 rounded-lg font-medium text-white
    bg-gradient-to-r from-green-500 via-emerald-500 to-green-600
    shadow-lg shadow-green-500/30
    hover:shadow-green-500/50 hover:scale-105
    transition-all duration-300"
            >
              ✨ AI Planner
            </Link>
          )}

          {/* Right links */}
          {rightItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-700 dark:text-slate-100 hover:text-green-600 transition"
            >
              {item.name}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-300 dark:border-slate-500
                       text-gray-700 dark:text-slate-100
                       hover:bg-gray-100 dark:hover:bg-slate-700
                       transition"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Profile */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700 dark:text-slate-100">
                {user.fullName}
              </span>

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="text-2xl cursor-pointer hover:scale-110 transition text-gray-700 dark:text-slate-100">
              👤
            </div>
          )}
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden text-2xl text-gray-700 dark:text-slate-100"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-600">
          {[...leftItems, ...rightItems].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className="block text-gray-700 dark:text-slate-100 hover:text-green-600"
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full text-left px-4 py-2 rounded border
                       border-gray-300 dark:border-slate-500
                       text-gray-700 dark:text-slate-100
                       hover:bg-gray-100 dark:hover:bg-slate-700
                       transition"
          >
            {theme === "light"
              ? "🌙 Switch to Dark Mode"
              : "☀️ Switch to Light Mode"}
          </button>

          <Link
            to="/ai"
            onClick={() => setOpen(false)}
            className="block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-center"
          >
            ✨ AI Planner
          </Link>
        </div>
      )}
    </nav>
  );
}
