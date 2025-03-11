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
  const [cartItems, setCartItems] = useState(() => {
    try {
      // Load cart items from localStorage on initial render
      const savedCartItems = localStorage.getItem("cartItems");
      return savedCartItems ? JSON.parse(savedCartItems) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      toast.error("Failed to load your cart. Starting with an empty cart.");
      return [];
    }
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
      toast.error("Failed to save your cart. Changes may not persist after refresh.");
    }
  }, [cartItems]);

  const addToCart = (item) => {
    try {
      if (!item || !item.product_id) {
        toast.error("Invalid product. Cannot add to cart.");
        return false;
      }

      // Check if item already exists in cart
      const existingItem = cartItems.find(
        (cartItem) => cartItem.product_id === item.product_id
      );
      
      if (existingItem) {
        toast.info(`${item.product_title} is already in your cart!`);
        return false;
      }
      
      // Calculate current total price
      const currentTotal = cartItems.reduce((total, item) => total + (parseFloat(item.price) || 0), 0);
      const itemPrice = parseFloat(item.price) || 0;
      
      // Check if adding this item would exceed $1000
      if (currentTotal + itemPrice > 1000) {
        toast.error("Cannot add item. Cart total would exceed $1000!");
        return false;
      }
      
      setCartItems((prevItems) => [...prevItems, item]);
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
      if (!productId) {
        toast.error("Invalid product ID. Cannot remove from cart.");
        return;
      }

      const itemToRemove = cartItems.find(item => item.product_id === productId);
      if (itemToRemove) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.product_id !== productId)
        );
        toast.info(`${itemToRemove.product_title} removed from cart.`);
      } else {
        toast.error("Item not found in cart.");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart. Please try again.");
    }
  };

  const clearCart = () => {
    try {
      setCartItems([]);
      toast.info("Cart has been cleared.");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart. Please try again.");
    }
  };

  const totalPrice = () => {
    try {
      return cartItems.reduce((total, item) => total + (parseFloat(item.price) || 0), 0).toFixed(2);
    } catch (error) {
      console.error("Error calculating total price:", error);
      return "0.00";
    }
  };

  const sortCartByPrice = () => {
    try {
      if (cartItems.length <= 1) {
        toast.info("Need at least two items to sort.");
        return;
      }
      
      setCartItems([...cartItems].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)));
      toast.info("Cart items sorted by price (high to low).");
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
