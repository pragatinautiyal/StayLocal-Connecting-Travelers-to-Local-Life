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
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
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

          <p className="mt-3 text-gray-600 dark:text-slate-400 text-center">
            Manage your listings and monitor your activity.
          </p>

          {loading ? (
            <div className="mt-20 flex justify-center">
              <Loader />
            </div>
          ) : (
            <>
              {/* STATS */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm">
                  <h2 className="text-green-700 font-semibold text-lg">
                    Total Listings
                  </h2>

                  <p className="text-3xl font-bold mt-2">
                    {stats?.totalListings || 0}
                  </p>

                  <p className="text-sm text-gray-500">Active listings</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm">
                  <h2 className="text-green-700 font-semibold text-lg">
                    Average Price
                  </h2>

                  <p className="text-3xl font-bold mt-2">
                    ₹{stats?.averagePrice || 0}
                  </p>

                  <p className="text-sm text-gray-500">Across listings</p>
                </div>

                <div className="p-6 bg-white dark:bg-slate-800 border rounded-2xl shadow-sm">
                  <h2 className="text-green-700 font-semibold text-lg">
                    Locations Covered
                  </h2>

                  <p className="text-3xl font-bold mt-2">
                    {stats?.locationsCovered || 0}
                  </p>

                  <p className="text-sm text-gray-500">Unique destinations</p>
                </div>
              </div>

              {/* RECENT LISTINGS */}

              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Recent Listings</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {stats?.recentListings?.map((listing) => (
                    <div
                      key={listing.id}
                      className="overflow-hidden bg-white dark:bg-slate-800 border rounded-2xl shadow-sm"
                    >
                      <img
                        src={listing.images?.[0]}
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />

                      <div className="p-5">
                        <h3 className="font-semibold text-lg">
                          {listing.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                          {listing.city}, {listing.state}
                        </p>

                        <p className="font-bold text-green-600 mt-3">
                          ₹{listing.price} {listing.priceUnit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION */}

              <div className="mt-12">
                <div className="p-6 bg-white dark:bg-slate-800 border rounded-2xl">
                  <h3 className="font-semibold text-lg">Manage Listings</h3>

                  <p className="text-sm mt-2 text-gray-500">
                    Add new listings, edit details, update prices and manage
                    your services.
                  </p>

                  <div className="mt-4">
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
