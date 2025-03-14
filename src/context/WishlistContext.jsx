import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "./CartContext";
import PropTypes from "prop-types";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

// Wishlist Provider 
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { addToCart } = useCart();

  useEffect(() => {
    try {
      const savedWishlistItems = localStorage.getItem("wishlistItems");
      console.log("Loading wishlist from localStorage:", savedWishlistItems);

      if (savedWishlistItems) {
        const parsedItems = JSON.parse(savedWishlistItems);
        if (Array.isArray(parsedItems)) {
          const validItems = parsedItems.filter(item => 
            item && 
            item.product_id && 
            item.product_title && 
            item.product_image && 
            item.price !== undefined
          );
          
          if (validItems.length !== parsedItems.length) {
            console.warn(`Filtered out ${parsedItems.length - validItems.length} invalid wishlist items`);
          }
          
          console.log("Valid wishlist items loaded:", validItems);
          setWishlistItems(validItems);
        } else {
          console.error("Invalid wishlist data format in localStorage:", parsedItems);
          localStorage.removeItem("wishlistItems");
          setWishlistItems([]);
        }
      }
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      toast.error("Failed to load your wishlist. Starting with an empty wishlist.");
      localStorage.removeItem("wishlistItems");
      setWishlistItems([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);


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


      const productId = typeof item.product_id === 'string' 
        ? parseInt(item.product_id) 
        : item.product_id;

      const existingItem = wishlistItems.find(
        (wishlistItem) => wishlistItem.product_id === productId
      );
      
      if (existingItem) {
        console.log("Item already exists in wishlist:", existingItem);
        toast.info(`${item.product_title} is already in your wishlist!`);
        return false;
      }

      let productImage = item.product_image;
      if (productImage && !productImage.startsWith('http') && !productImage.startsWith('/')) {
        productImage = `/${productImage}`;
      }

      const itemToAdd = {
        product_id: productId,
        product_title: item.product_title,
        product_image: productImage,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        category: item.category || "unknown"
      };

      console.log("Formatted item to add to wishlist:", itemToAdd);
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
