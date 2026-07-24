import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader } from "../components/ui";

export default function ListingDetails() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch listing details and check initial wishlist status concurrently
    const fetchListingData = async () => {
      try {
        const listingRes = await fetch(
          `http://127.0.0.1:8000/api/listings/${id}`,
        );
        const listingData = await listingRes.json();
        setListing(listingData);

        // Fetch wishlist IDs if the user is authenticated
        if (token) {
          const wishlistRes = await fetch(
            `http://127.0.0.1:8000/api/wishlist/ids`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (wishlistRes.ok) {
            const wishlistIds = await wishlistRes.json();
            // Check if current listing ID is in user's wishlist
            setIsWishlisted(wishlistIds.includes(Number(id)));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListingData();
  }, [id]);

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to save listings to your wishlist.");
      return;
    }

    setWishlistLoading(true);

    try {
      const endpoint = `http://127.0.0.1:8000/api/wishlist/${id}`;
      const method = isWishlisted ? "DELETE" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsWishlisted((prev) => !prev);
      } else {
        alert(data.detail || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!listing) {
    return <h2 className="text-center text-xl mt-10">Listing not found</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-8">
        <div className="relative">
          <img
            src={listing.images?.[0]}
            alt={listing.title}
            className="w-full h-96 object-cover rounded-xl"
          />

          {/* Quick Wishlist Heart Button overlay on Image */}
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className="absolute top-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-105 transition-all"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`w-6 h-6 transition-colors ${
                isWishlisted
                  ? "fill-red-500 stroke-red-500"
                  : "fill-transparent stroke-slate-700 dark:stroke-slate-200"
              }`}
              strokeWidth="2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <p className="text-gray-500">{listing.listingType}</p>
          </div>

          {/* Wishlist Action Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm transition-all shadow-sm ${
              isWishlisted
                ? "border-red-200 bg-red-50 text-red-600 dark:bg-red-950/60 dark:border-red-800 dark:text-red-400"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`w-5 h-5 transition-colors ${
                isWishlisted
                  ? "fill-red-500 stroke-red-500"
                  : "fill-transparent stroke-slate-700 dark:stroke-slate-200"
              }`}
              strokeWidth="2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>
              {isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}
            </span>
          </button>
        </div>

        <p className="mt-3 text-slate-600 dark:text-slate-400">
          📍 {listing.city}, {listing.state}
        </p>

        <p className="mt-5 text-slate-700 dark:text-slate-300 leading-relaxed">
          {listing.description}
        </p>

        <div className="mt-5 text-2xl font-bold text-green-700 dark:text-green-400">
          ₹{listing.price} / {listing.priceUnit}
        </div>

        <div className="mt-5">
          <span className="bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 px-3.5 py-1.5 rounded-full text-sm font-semibold">
            {listing.category}
          </span>
        </div>
      </div>

      <Footer />
    </>
  );
}
