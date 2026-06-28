import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { Loader } from "../components/ui";

export default function Explore() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/listings")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load listings");
        }
        return response.json();
      })
      .then((data) => {
        setListings(data);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);

        setToast("Failed to load listings");

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
            Explore Homestays
          </h1>

          <p className="mt-3 text-gray-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
            Discover eco-friendly stays, village homes, and nature retreats
            across India based on your budget and travel style.
          </p>

          {loading ? (
            <div className="mt-16 flex justify-center">
              <Loader />
            </div>
          ) : listings.length === 0 ? (
            <div className="mt-10 text-center text-gray-500 dark:text-gray-400">
              No listings available.
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card
                  key={listing.id}
                  title={listing.title}
                  description={listing.description}
                  image={listing.image}
                  price={listing.price}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
