// src/context/WishlistContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "./CartContext";

// Create Wishlist Context
const WishlistContext = createContext();

// Custom Hook for using Wishlist Context
export const useWishlist = () => {
  return useContext(WishlistContext);
};

// Wishlist Provider Component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    // Load wishlist items from localStorage on initial render
    const savedWishlistItems = localStorage.getItem("wishlistItems");
    return savedWishlistItems ? JSON.parse(savedWishlistItems) : [];
  });
  
  const { addToCart } = useCart();

  // Save wishlist items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (item) => {
    if (
      !wishlistItems.find(
        (wishlistItem) => wishlistItem.product_id === item.product_id
      )
    ) {
      setWishlistItems((prevItems) => [...prevItems, item]);
      toast.success(`${item.product_title} added to wishlist!`);
      return true;
    }
    toast.info("This item is already in your wishlist!");
    return false;
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== productId)
    );
  };

  const moveToCart = (productId) => {
    const item = wishlistItems.find(item => item.product_id === productId);
    if (item) {
      const success = addToCart(item);
      if (success) {
        removeFromWishlist(productId);
      }
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
