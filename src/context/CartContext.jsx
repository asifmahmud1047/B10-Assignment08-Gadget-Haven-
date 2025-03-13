// src/context/CartContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

// Create Cart Context
const CartContext = createContext();

// Custom Hook for using Cart Context
export const useCart = () => {
  return useContext(CartContext);
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart items from localStorage on initial render
  useEffect(() => {
    try {
      const savedCartItems = localStorage.getItem("cartItems");
      console.log("Loading cart from localStorage:", savedCartItems);
      
      if (savedCartItems) {
        const parsedItems = JSON.parse(savedCartItems);
        if (Array.isArray(parsedItems)) {
          setCartItems(parsedItems);
        } else {
          console.error("Invalid cart data format in localStorage:", parsedItems);
          setCartItems([]);
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      toast.error("Failed to load your cart. Starting with an empty cart.");
      setCartItems([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      console.log("Saving cart to localStorage:", cartItems);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
      toast.error("Failed to save your cart. Changes may not persist after refresh.");
    }
  }, [cartItems, isInitialized]);

  const addToCart = (item) => {
    try {
      console.log("Adding item to cart:", item);
      
      if (!item || !item.product_id) {
        console.error("Invalid product data:", item);
        toast.error("Invalid product. Cannot add to cart.");
        return false;
      }

      // Check if item already exists in cart
      const existingItem = cartItems.find(
        (cartItem) => cartItem.product_id === item.product_id
      );
      
      if (existingItem) {
        console.log("Item already exists in cart:", existingItem);
        toast.info(`${item.product_title} is already in your cart!`);
        return false;
      }
      
      // Calculate current total price
      const currentTotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) || 0), 0);
      const itemPrice = parseFloat(item.price) || 0;
      
      // Check if adding this item would exceed $1000
      if (currentTotal + itemPrice > 1000) {
        console.log("Adding item would exceed $1000 limit. Current total:", currentTotal, "Item price:", itemPrice);
        toast.error("Cannot add item. Cart total would exceed $1000!");
        return false;
      }
      
      // Ensure the item has all required fields
      const itemToAdd = {
        product_id: typeof item.product_id === 'string' ? parseInt(item.product_id) : item.product_id,
        product_title: item.product_title,
        product_image: item.product_image,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        category: item.category || "unknown"
      };
      
      setCartItems((prevItems) => [...prevItems, itemToAdd]);
      console.log("Item added to cart successfully:", itemToAdd);
      toast.success(`${item.product_title} added to cart!`);
      return true;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
      return false;
    }
  };

  const removeFromCart = (productId) => {
    try {
      console.log("Removing item from cart with ID:", productId);
      if (!productId) {
        toast.error("Invalid product ID. Cannot remove from cart.");
        return;
      }

      const productIdNum = typeof productId === 'string' ? parseInt(productId) : productId;
      const itemToRemove = cartItems.find(item => item.product_id === productIdNum);
      
      if (itemToRemove) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.product_id !== productIdNum)
        );
        console.log("Item removed from cart:", itemToRemove);
        toast.info(`${itemToRemove.product_title} removed from cart.`);
      } else {
        console.error("Item not found in cart with ID:", productId);
        toast.error("Item not found in cart.");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart. Please try again.");
    }
  };

  const clearCart = () => {
    try {
      console.log("Clearing cart");
      setCartItems([]);
      toast.info("Cart has been cleared.");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart. Please try again.");
    }
  };

  const totalPrice = () => {
    try {
      const total = cartItems.reduce((total, item) => total + (parseFloat(item.price) || 0), 0).toFixed(2);
      console.log("Calculated total price:", total);
      return total;
    } catch (error) {
      console.error("Error calculating total price:", error);
      return "0.00";
    }
  };

  const sortCartByPrice = (direction = 'desc') => {
    try {
      if (cartItems.length <= 1) {
        toast.info("Need at least two items to sort.");
        return;
      }
      
      if (direction === 'asc') {
        // Sort low to high
        setCartItems([...cartItems].sort((a, b) => parseFloat(a.price) - parseFloat(b.price)));
        toast.info("Cart items sorted by price (low to high).");
      } else {
        // Sort high to low (default)
        setCartItems([...cartItems].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)));
        toast.info("Cart items sorted by price (high to low).");
      }
    } catch (error) {
      console.error("Error sorting cart:", error);
      toast.error("Failed to sort cart. Please try again.");
    }
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        totalPrice, 
        sortCartByPrice 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};
