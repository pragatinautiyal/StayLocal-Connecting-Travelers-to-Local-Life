import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button, Loader } from "../components/ui";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col bg-green-50 dark:bg-slate-900 transition-colors duration-300">
      {toast && (
        <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      <Navbar />

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
            Provider Dashboard
          </h1>

          <p className="mt-3 text-gray-600 dark:text-slate-300 text-center">
            Manage your listings and monitor your activity.
          </p>

          {loading ? (
            <div className="mt-20 flex justify-center">
              <Loader />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-lg transition-all p-6">
                  <h2 className="text-lg font-semibold text-green-700 dark:text-green-400">
                    Total Listings
                  </h2>

                  <p className="text-3xl font-bold mt-3 text-gray-900 dark:text-white">
                    {stats?.totalListings || 0}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                    Active listings
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-lg transition-all p-6">
                  <h2 className="text-lg font-semibold text-green-700 dark:text-green-400">
                    Average Price
                  </h2>

                  <p className="text-3xl font-bold mt-3 text-gray-900 dark:text-white">
                    ₹{stats?.averagePrice || 0}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                    Across listings
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-lg transition-all p-6">
                  <h2 className="text-lg font-semibold text-green-700 dark:text-green-400">
                    Locations Covered
                  </h2>

                  <p className="text-3xl font-bold mt-3 text-gray-900 dark:text-white">
                    {stats?.locationsCovered || 0}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                    Unique destinations
                  </p>
                </div>
              </div>

              {/* Recent Listings */}
              <div className="mt-14">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                  Recent Listings
                </h2>

                {stats?.recentListings?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.recentListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <img
                          src={listing.images?.[0]}
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                        />

                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {listing.title}
                          </h3>

                          <p className="mt-2 text-sm text-gray-500">
                            📍 {listing.city}, {listing.state}
                          </p>

                          <p className="mt-3 text-lg font-bold text-green-600">
                            ₹{listing.price} {listing.priceUnit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-md">
                    <p className="text-gray-600">No listings available yet.</p>
                  </div>
                )}
              </div>

              {/* Action Card */}
              <div className="mt-14">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Manage Listings
                  </h3>

                  <p className="mt-3 text-gray-600 dark:text-slate-400">
                    Add new listings, edit details, update pricing, and manage
                    all your services from one place.
                  </p>

                  <div className="mt-6">
                    <Button
                      label="Go to Listings"
                      onClick={() => navigate("/my-listings")}
                    />
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
