import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { Loader } from "../components/ui";
import API_URL from "../api/config";

export default function Explore() {
  const [listings, setListings] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const city = searchParams.get("city") || "";
  const category = searchParams.get("category") || "";
  const listingType = searchParams.get("listingType") || "";
  const budget = searchParams.get("budget") || "";

  // Helper function moved ABOVE useEffect so it's defined before use
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      let url = `${API_URL}/api/listings`;
      if (city || category || listingType || budget) {
        const params = new URLSearchParams();

        if (city) params.append("city", city);
        if (category) params.append("category", category);
        if (listingType) params.append("listingType", listingType);

        if (budget) {
          if (budget === "0-1000") {
            params.append("minPrice", "0");
            params.append("maxPrice", "1000");
          } else if (budget === "1000-3000") {
            params.append("minPrice", "1000");
            params.append("maxPrice", "3000");
          } else if (budget === "3000+") {
            params.append("minPrice", "3000");
          }
        }

        url = `${API_URL}/api/listings/search?${params.toString()}`;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load listings");
        const data = await res.json();
        setListings(data);

        if (token) {
          const wishRes = await fetch(`${API_URL}/api/wishlist/ids`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (wishRes.ok) {
            const ids = await wishRes.json();
            setWishlistIds(ids);
          }
        }
      } catch (error) {
        console.error(error);
        showToast("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city, category, listingType, budget]);

  const handleWishlistToggle = async (listingId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Please log in to save listings.");
      return;
    }

    const isSaved = wishlistIds.includes(listingId);
    const endpoint = `${API_URL}/api/wishlist/${listingId}`;
    const method = isSaved ? "DELETE" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (isSaved) {
          setWishlistIds((prev) => prev.filter((id) => id !== listingId));
          showToast("Removed from wishlist");
        } else {
          setWishlistIds((prev) => [...prev, listingId]);
          showToast("Saved to wishlist");
        }
      } else {
        showToast(data.detail || "Action failed");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update wishlist");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      {toast && (
        <div className="fixed top-5 right-5 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium">
          {toast}
        </div>
      )}

      <Navbar />

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 text-center">
            Explore Local Experiences
          </h1>

          <p className="mt-3 text-gray-600 dark:text-slate-400 text-center max-w-3xl mx-auto">
            Discover authentic homestays, cafés, rentals, workshops, food spots,
            and unique local experiences across India.
          </p>

          {/* Active Filters */}
          {(city || category || listingType || budget) && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {city && (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full">
                  📍 {city}
                </span>
              )}

              {category && (
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                  {category}
                </span>
              )}

              {listingType && (
                <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full">
                  {listingType}
                </span>
              )}

              {budget && (
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
                  ₹ {budget}
                </span>
              )}

              <button
                onClick={() => navigate("/explore")}
                className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          {loading ? (
            <div className="mt-16 flex justify-center">
              <Loader />
            </div>
          ) : listings.length === 0 ? (
            <div className="mt-12 text-center">
              <div className="mt-16 text-center">
                <div className="text-6xl">🔍</div>

                <h2 className="mt-4 text-2xl font-bold text-gray-700 dark:text-white">
                  No Listings Found
                </h2>

                <p className="mt-3 text-gray-500 dark:text-gray-400">
                  We couldn't find any listings matching your filters.
                </p>

                <button
                  onClick={() => navigate("/explore")}
                  className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
                >
                  View All Listings
                </button>
              </div>

              <p className="mt-3 text-gray-500">
                Try changing your filters or search another destination.
              </p>
            </div>
          ) : (
            <>
              <p className="mt-8 text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-green-600">
                  {listings.length}
                </span>{" "}
                {listings.length === 1 ? "listing" : "listings"}
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Card
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    description={listing.description}
                    image={listing.images?.[0]}
                    price={listing.price}
                    priceUnit={listing.priceUnit}
                    category={listing.category}
                    listingType={listing.listingType}
                    city={listing.city}
                    state={listing.state}
                    isWishlisted={wishlistIds.includes(listing.id)}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
