// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create Cart Context
const CartContext = createContext();

// Custom Hook for using Cart Context
export const useCart = () => {
  return useContext(CartContext);
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart items from localStorage on initial render
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    // Calculate current total price
    const currentTotal = cartItems.reduce((total, item) => total + item.price, 0);
    
    // Check if adding this item would exceed $1000
    if (currentTotal + item.price > 1000) {
      toast.error("Cannot add item. Cart total would exceed $1000!");
      return false;
    }
    
    setCartItems((prevItems) => [...prevItems, item]);
    toast.success(`${item.product_title} added to cart!`);
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const sortCartByPrice = () => {
    setCartItems([...cartItems].sort((a, b) => b.price - a.price));
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
