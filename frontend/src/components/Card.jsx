import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui";
import { useWishlist } from "../context/WishlistContext";

export default function Card({
  id,
  title,
  description,
  image,
  price,
  priceUnit,
  category,
  listingType,
  city,
  state,
}) {
  const navigate = useNavigate();
  const { wishlistIds, setWishlistIds } = useWishlist();

  const wishlisted = wishlistIds.includes(id);
  const [message, setMessage] = useState("");

  const addToWishlist = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/wishlist/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to add wishlist");
      }

      // Update global wishlist state
      setWishlistIds([...wishlistIds, id]);

      setMessage("Added to wishlist ❤️");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error(error);

      setMessage(error.message);

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative">
        <img src={image} alt={title} className="h-44 w-full object-cover" />

        {/* Wishlist Button */}
        <button
          onClick={addToWishlist}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
        >
          {wishlisted ? "❤️" : "♡"}
        </button>
      </div>

      {/* Toast */}
      {message && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <span className="inline-block w-fit bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
          {category}
        </span>

        <h2 className="text-lg font-bold text-gray-900">{title}</h2>

        <p className="text-sm text-gray-500">{listingType}</p>

        <p className="text-sm text-gray-600 mt-1">
          📍 {city}, {state}
        </p>

        <p className="text-gray-600 text-sm mt-3 line-clamp-3">{description}</p>

        <div className="mt-auto pt-5 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-green-700">₹{price}</p>

            <p className="text-xs text-gray-500">{priceUnit}</p>
          </div>

          <Button
            label="View Details"
            variant="secondary"
            onClick={() => navigate(`/listing/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}
