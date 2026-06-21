import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const leftItems = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const rightItems = [
    { name: "Settings", path: "/settings" },
    { name: "Login", path: "/login" },
  ];

  return (
    <nav className="bg-white shadow-md">
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
              className="text-gray-700 hover:text-green-600 transition"
            >
              {item.name}
            </Link>
          ))}

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {/* AI Planner */}
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

          {/* Right links */}
          {rightItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-700 hover:text-green-600 transition"
            >
              {item.name}
            </Link>
          ))}

          {/* Profile */}
          <div className="text-2xl cursor-pointer hover:scale-110 transition text-gray-700">
            👤
          </div>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3 bg-white border-t border-gray-200">
          {[...leftItems, ...rightItems].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className="block text-gray-700 hover:text-green-600"
            >
              {item.name}
            </Link>
          ))}

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
