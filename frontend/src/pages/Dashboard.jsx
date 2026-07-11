import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button, Loader } from "../components/ui";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load dashboard");
        }
        return response.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.error(error);
        setToast("Failed to load dashboard data");

        setTimeout(() => {
          setToast("");
        }, 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      <Navbar />

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 text-center">
            Provider Dashboard
          </h1>

          <p className="mt-3 text-gray-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
            Manage your homestay listings and monitor platform activity.
          </p>

          {/* LOADER */}
          {loading ? (
            <div className="mt-20 flex justify-center">
              <Loader />
            </div>
          ) : (
            <>
              {/* STATS */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition">
                  <h2 className="text-green-700 dark:text-green-400 font-semibold text-lg">
                    Total Listings
                  </h2>

                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-slate-100">
                    {stats?.totalListings || 0}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Active homestays
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition">
                  <h2 className="text-green-700 dark:text-green-400 font-semibold text-lg">
                    Average Price
                  </h2>

                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-slate-100">
                    ₹{stats?.averagePrice || 0}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Across all listings
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition">
                  <h2 className="text-green-700 dark:text-green-400 font-semibold text-lg">
                    Locations Covered
                  </h2>

                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-slate-100">
                    {stats?.locationsCovered || 0}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Unique destinations
                  </p>
                </div>
              </div>

              {/* RECENT LISTINGS */}
              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-slate-100 mb-6">
                  Recent Listings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats?.recentListings?.map((listing) => (
                    <div
                      key={listing.id}
                      className="overflow-hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />

                      <div className="p-5">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-slate-100">
                          {listing.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                          {listing.location}
                        </p>

                        <p className="font-bold text-green-600 mt-3">
                          ₹{listing.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl">
                  <h3 className="font-semibold text-lg">Manage Listings</h3>

                  <p className="text-sm mt-2 text-gray-500">
                    Add new homestays, edit details and update availability.
                  </p>

                  <div className="mt-4">
                    <Button label="Go to Listings" />
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl">
                  <h3 className="font-semibold text-lg">AI Travel Planner</h3>

                  <p className="text-sm mt-2 text-gray-500">
                    Generate personalized recommendations using your AI engine.
                  </p>

                  <div className="mt-4">
                    <Button label="Open Planner" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
