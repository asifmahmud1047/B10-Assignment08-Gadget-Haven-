// src/context/WishlistContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "./CartContext";
import PropTypes from "prop-types";

// Create Wishlist Context
const WishlistContext = createContext();

// Custom Hook for using Wishlist Context
export const useWishlist = () => {
  return useContext(WishlistContext);
};

// Wishlist Provider Component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      // Load wishlist items from localStorage on initial render
      const savedWishlistItems = localStorage.getItem("wishlistItems");
      return savedWishlistItems ? JSON.parse(savedWishlistItems) : [];
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      toast.error("Failed to load your wishlist. Starting with an empty wishlist.");
      return [];
    }
  });
  
  const { addToCart } = useCart();

  // Save wishlist items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
      toast.error("Failed to save your wishlist. Changes may not persist after refresh.");
    }
  }, [wishlistItems]);

  const addToWishlist = (item) => {
    try {
      if (!item || !item.product_id) {
        toast.error("Invalid product. Cannot add to wishlist.");
        return false;
      }

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
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      toast.error("Failed to add item to wishlist. Please try again.");
      return false;
    }
  };

  const removeFromWishlist = (productId) => {
    try {
      if (!productId) {
        toast.error("Invalid product ID. Cannot remove from wishlist.");
        return;
      }

      const itemToRemove = wishlistItems.find(item => item.product_id === productId);
      if (itemToRemove) {
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.product_id !== productId)
        );
        toast.info(`${itemToRemove.product_title} removed from wishlist.`);
      } else {
        toast.error("Item not found in wishlist.");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove item from wishlist. Please try again.");
    }
  };

  const moveToCart = (productId) => {
    try {
      if (!productId) {
        toast.error("Invalid product ID. Cannot move to cart.");
        return;
      }

      const item = wishlistItems.find(item => item.product_id === productId);
      if (item) {
        const success = addToCart(item);
        if (success) {
          removeFromWishlist(productId);
          toast.success(`${item.product_title} moved to cart!`);
        } else {
          // If addToCart returns false, it means the cart total would exceed $1000
          // or the item is already in the cart. The toast error is already shown in the CartContext
        }
      } else {
        toast.error("Item not found in wishlist.");
      }
    } catch (error) {
      console.error("Error moving item to cart:", error);
      toast.error("Failed to move item to cart. Please try again.");
    }
  };

  const clearWishlist = () => {
    try {
      setWishlistItems([]);
      toast.info("Wishlist has been cleared.");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist. Please try again.");
    }
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

WishlistProvider.propTypes = {
  children: PropTypes.node.isRequired
};
