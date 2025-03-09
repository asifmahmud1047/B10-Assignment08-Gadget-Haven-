import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar() {
  const { cartItems } = useCart();
  const location = useLocation();

  return (
    <nav className={`navbar ${location.pathname === "/" ? "home-navbar" : ""}`}>
      <div className="navbar-logo">
        <NavLink to="/">
          <span className="logo-text">GadgetHaven</span>
          <span className="logo-sparkle">✨</span>
        </NavLink>
      </div>
      <div className="navbar-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Home
        </NavLink>
        <NavLink 
          to="/stats" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Stats
        </NavLink>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/additional" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          About Us
        </NavLink>
      </div>
      <div className="cart-icon">
        <NavLink to="/dashboard" className="cart-link">
          <FontAwesomeIcon icon={faShoppingCart} />
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
