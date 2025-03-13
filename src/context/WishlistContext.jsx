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
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { addToCart } = useCart();

  // Load wishlist items from localStorage on initial render
  useEffect(() => {
    try {
      const savedWishlistItems = localStorage.getItem("wishlistItems");
      console.log("Loading wishlist from localStorage:", savedWishlistItems);
      
      if (savedWishlistItems) {
        const parsedItems = JSON.parse(savedWishlistItems);
        if (Array.isArray(parsedItems)) {
          setWishlistItems(parsedItems);
        } else {
          console.error("Invalid wishlist data format in localStorage:", parsedItems);
          setWishlistItems([]);
        }
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      toast.error("Failed to load your wishlist. Starting with an empty wishlist.");
      setWishlistItems([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save wishlist items to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      console.log("Saving wishlist to localStorage:", wishlistItems);
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
      toast.error("Failed to save your wishlist. Changes may not persist after refresh.");
    }
  }, [wishlistItems, isInitialized]);

  const addToWishlist = (item) => {
    try {
      console.log("Adding item to wishlist:", item);
      
      if (!item || !item.product_id) {
        console.error("Invalid product data:", item);
        toast.error("Invalid product. Cannot add to wishlist.");
        return false;
      }

      // Normalize product_id to number
      const productId = typeof item.product_id === 'string' ? parseInt(item.product_id) : item.product_id;

      // Check if item already exists in wishlist
      const existingItem = wishlistItems.find(
        (wishlistItem) => wishlistItem.product_id === productId
      );
      
      if (existingItem) {
        console.log("Item already exists in wishlist:", existingItem);
        toast.info("This item is already in your wishlist!");
        return false;
      }
      
      // Ensure the item has all required fields
      const itemToAdd = {
        product_id: productId,
        product_title: item.product_title,
        product_image: item.product_image,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        category: item.category || "unknown"
      };
      
      setWishlistItems((prevItems) => [...prevItems, itemToAdd]);
      console.log("Item added to wishlist successfully:", itemToAdd);
      toast.success(`${item.product_title} added to wishlist!`);
      return true;
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      toast.error("Failed to add item to wishlist. Please try again.");
      return false;
    }
  };

  const removeFromWishlist = (productId) => {
    try {
      console.log("Removing item from wishlist with ID:", productId);
      if (!productId) {
        toast.error("Invalid product ID. Cannot remove from wishlist.");
        return;
      }

      const productIdNum = typeof productId === 'string' ? parseInt(productId) : productId;
      const itemToRemove = wishlistItems.find(item => item.product_id === productIdNum);
      
      if (itemToRemove) {
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.product_id !== productIdNum)
        );
        console.log("Item removed from wishlist:", itemToRemove);
        toast.info(`${itemToRemove.product_title} removed from wishlist.`);
      } else {
        console.error("Item not found in wishlist with ID:", productId);
        toast.error("Item not found in wishlist.");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove item from wishlist. Please try again.");
    }
  };

  const moveToCart = (productId) => {
    try {
      console.log("Moving item to cart with ID:", productId);
      if (!productId) {
        toast.error("Invalid product ID. Cannot move to cart.");
        return;
      }

      const productIdNum = typeof productId === 'string' ? parseInt(productId) : productId;
      const item = wishlistItems.find(item => item.product_id === productIdNum);
      
      if (item) {
        console.log("Found item in wishlist:", item);
        
        // Ensure the item has all required fields
        const itemToAdd = {
          product_id: item.product_id,
          product_title: item.product_title,
          product_image: item.product_image,
          price: item.price,
          category: item.category || "unknown"
        };
        
        const success = addToCart(itemToAdd);
        if (success) {
          removeFromWishlist(productIdNum);
          console.log("Item moved to cart successfully");
          toast.success(`${item.product_title} moved to cart!`);
        } else {
          // If addToCart returns false, it means the cart total would exceed $1000
          // or the item is already in the cart. The toast error is already shown in the CartContext
          console.log("Failed to add item to cart from wishlist");
        }
      } else {
        console.error("Item not found in wishlist with ID:", productId);
        toast.error("Item not found in wishlist.");
        console.log("Current wishlist items:", wishlistItems);
      }
    } catch (error) {
      console.error("Error moving item to cart:", error);
      toast.error("Failed to move item to cart. Please try again.");
    }
  };

  const clearWishlist = () => {
    try {
      console.log("Clearing wishlist");
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
