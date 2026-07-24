import { useEffect, useState } from "react";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader } from "../components/ui";

export default function Wishlist() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch wishlist");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Wishlist data:", data);
        setListings(data);
      })
      .catch((err) => {
        console.error(err);
        showToast("Failed to load wishlist items");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleRemoveFromWishlist = async (listingId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Please log in to manage your wishlist");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/wishlist/${listingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok && data.success) {
        // Optimistically remove item from UI state
        setListings((prevListings) =>
          prevListings.filter((item) => item.id !== listingId),
        );
        showToast("Removed from wishlist");
      } else {
        showToast(data.detail || "Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update wishlist");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50 dark:bg-gray-900 transition-colors">
      {toast && (
        <div className="fixed top-5 right-5 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium">
          {toast}
        </div>
      )}

      <Navbar />

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
            My Wishlist ❤️
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
            View and manage your saved listings for future trips.
          </p>

          {/* Wishlist Content */}
          {loading ? (
            <div className="mt-16 flex justify-center">
              <Loader />
            </div>
          ) : listings.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No wishlist items yet ❤️
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <Card
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  image={item.images?.[0]}
                  price={item.price}
                  priceUnit={item.priceUnit}
                  category={item.category}
                  listingType={item.listingType}
                  city={item.city}
                  state={item.state}
                  isWishlisted={true}
                  onWishlistToggle={handleRemoveFromWishlist}
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
