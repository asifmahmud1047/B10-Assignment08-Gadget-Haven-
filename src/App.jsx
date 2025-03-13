// App.jsx
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdditionalPage from "./pages/AdditionalPage";
import Stats from "./pages/Stats";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

// Test localStorage functionality
const testLocalStorage = () => {
  try {
    // Test if localStorage is available
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('localStorage is working correctly');
    
    // Log existing cart and wishlist items
    const cartItems = localStorage.getItem('cartItems');
    const wishlistItems = localStorage.getItem('wishlistItems');
    
    console.log('Existing cart items in localStorage:', cartItems);
    console.log('Existing wishlist items in localStorage:', wishlistItems);
    
    // If items exist but are not valid JSON, clear them
    if (cartItems) {
      try {
        JSON.parse(cartItems);
      } catch (e) {
        console.error('Invalid cart items in localStorage, clearing:', e);
        localStorage.removeItem('cartItems');
      }
    }
    
    if (wishlistItems) {
      try {
        JSON.parse(wishlistItems);
      } catch (e) {
        console.error('Invalid wishlist items in localStorage, clearing:', e);
        localStorage.removeItem('wishlistItems');
      }
    }
  } catch (e) {
    console.error('localStorage test failed:', e);
  }
};

const AppContent = () => {
  const location = useLocation();
  
  useEffect(() => {
    testLocalStorage();
  }, []);
  
  return (
    <div className={location.pathname === "/" ? "home-background" : "default-background"}>
      <Navbar />
      <div className="min-h-[calc(100vh-348px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/additional" element={<AdditionalPage />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ToastContainer position="top-right" autoClose={3000} />
            <AppContent />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </HelmetProvider>
  );
};

export default App;
