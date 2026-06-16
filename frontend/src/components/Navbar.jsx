import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-green-600 transition-transform duration-300 hover:scale-105"
        >
          StayLocal
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8">
          {["Home", "Explore", "Dashboard", "Login"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative text-gray-700 hover:text-green-600 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Profile Icon */}
        <div className="hidden md:block text-2xl cursor-pointer hover:scale-110 transition">
          👤
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 space-y-3">
          <Link
            className="block text-gray-700"
            to="/"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            className="block text-gray-700"
            to="/explore"
            onClick={() => setOpen(false)}
          >
            Explore
          </Link>
          <Link
            className="block text-gray-700"
            to="/dashboard"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            className="block text-gray-700"
            to="/login"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
