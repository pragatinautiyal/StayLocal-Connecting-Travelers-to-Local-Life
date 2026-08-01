import API_URL from "../api/config";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([]);
  const { user } = useAuth();

  const loadWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlistIds([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/wishlist/ids`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setWishlistIds([]);
        return;
      }

      const data = await response.json();
      setWishlistIds(data);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setWishlistIds([]);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [user]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        setWishlistIds,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
