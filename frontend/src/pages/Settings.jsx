import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { Input, Button } from "../components/ui";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-green-50 dark:bg-gray-900 transition-colors">
      <Navbar />

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
            Settings
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
            Manage your profile, preferences, and application settings.
          </p>

          {/* Card */}
          <div className="mt-10 max-w-xl mx-auto space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
            {/* Profile Info */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Profile Info
              </h2>

              <Input
                type="text"
                placeholder="Name"
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
              />

              <Input
                type="email"
                placeholder="Email"
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Change Password
              </h2>

              <Input
                type="password"
                placeholder="New Password"
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-5">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  Dark Mode
                </span>

                <Button
                  label={darkMode ? "Dark ON" : "Dark OFF"}
                  onClick={() => setDarkMode(!darkMode)}
                />
              </div>

              {/* Logout */}
              <Button
                label="Logout"
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
