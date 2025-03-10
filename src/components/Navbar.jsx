import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar() {
  const { cartItems } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when location changes (user navigates to a new page)
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${location.pathname === "/" ? "home-navbar" : ""}`}>
      <div className="navbar-logo">
        <NavLink to="/">
          <span className="logo-text">GadgetHaven</span>
          <span className="logo-sparkle">✨</span>
        </NavLink>
      </div>
      
      <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink 
          to="/stats" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={() => setMenuOpen(false)}
        >
          Stats
        </NavLink>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={() => setMenuOpen(false)}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/additional" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          onClick={() => setMenuOpen(false)}
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
