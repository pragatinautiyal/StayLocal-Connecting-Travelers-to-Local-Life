import { useEffect, useState } from "react";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Wishlist() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

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
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-green-50 dark:bg-gray-900 transition-colors">
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
          {listings.length === 0 ? (
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
