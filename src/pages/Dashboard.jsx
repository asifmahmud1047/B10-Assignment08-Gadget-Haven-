import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faTrash, faShoppingCart, faHeart, faExclamationCircle, faImage } from "@fortawesome/free-solid-svg-icons";
import PurchaseModal from "../components/PurchaseModal";
import "./Dashboard.css";

function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabParam === 'wishlist' ? 'wishlist' : 'cart');
  const [showModal, setShowModal] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const { cartItems, removeFromCart, clearCart, totalPrice, sortCartByPrice } = useCart();
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();

  // Update activeTab when URL changes
  useEffect(() => {
    if (tabParam === 'wishlist') {
      setActiveTab('wishlist');
    } else if (tabParam === 'cart') {
      setActiveTab('cart');
    }
  }, [tabParam]);

  // Reset image errors when cart or wishlist items change
  useEffect(() => {
    setImageErrors({});
  }, [cartItems, wishlistItems]);

  const handlePurchase = () => {
    if (cartItems.length > 0) {
      setShowModal(true);
    }
  };

  // Format price with commas for thousands
  const formatPrice = (price) => {
    try {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice)) return "$0.00";
      
      return numPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      });
    } catch (error) {
      console.error("Error formatting price:", error);
      return "$0.00";
    }
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <Helmet>
          <title>Gadget Heaven - Dashboard</title>
        </Helmet>
        <h1>Your Dashboard</h1>
        
        <div className="tabs">
          <button
            onClick={() => setActiveTab("cart")}
            className={activeTab === "cart" ? "tab-button active" : "tab-button"}
          >
            <FontAwesomeIcon icon={faShoppingCart} /> Cart
            {cartItems.length > 0 && <span className="item-count">{cartItems.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={activeTab === "wishlist" ? "tab-button active" : "tab-button"}
          >
            <FontAwesomeIcon icon={faHeart} /> Wishlist
            {wishlistItems.length > 0 && <span className="item-count">{wishlistItems.length}</span>}
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === "cart" ? (
            <div className="cart-tab">
              <div className="tab-header">
                <h2>Your Cart Items</h2>
                <div className="tab-actions">
                  <button 
                    className="sort-button"
                    onClick={sortCartByPrice}
                    disabled={cartItems.length <= 1}
                  >
                    <FontAwesomeIcon icon={faSort} /> Sort by Price
                  </button>
                  <div className="total-price">
                    Total: {formatPrice(totalPrice())}
                  </div>
                </div>
              </div>
              
              {cartItems.length === 0 ? (
                <div className="empty-message">
                  <FontAwesomeIcon icon={faExclamationCircle} size="2x" />
                  <p>Your cart is empty.</p>
                  <p className="sub-message">Add items from the product pages or your wishlist.</p>
                </div>
              ) : (
                <div className="items-grid">
                  {cartItems.map((item) => (
                    <div key={item.product_id} className="item-card">
                      {imageErrors[item.product_id] ? (
                        <div className="item-image placeholder-image">
                          <FontAwesomeIcon icon={faImage} size="2x" />
                        </div>
                      ) : (
                        <img 
                          src={item.product_image} 
                          alt={item.product_title} 
                          className="item-image"
                          onError={() => handleImageError(item.product_id)}
                        />
                      )}
                      <div className="item-details">
                        <h3>{item.product_title}</h3>
                        <p className="item-price">{formatPrice(item.price)}</p>
                        <button 
                          className="remove-button"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="purchase-section">
                <button 
                  className="purchase-button" 
                  disabled={cartItems.length === 0}
                  onClick={handlePurchase}
                >
                  Purchase
                </button>
              </div>
            </div>
          ) : (
            <div className="wishlist-tab">
              <h2>Your Wishlist</h2>
              
              {wishlistItems.length === 0 ? (
                <div className="empty-message">
                  <FontAwesomeIcon icon={faExclamationCircle} size="2x" />
                  <p>Your wishlist is empty.</p>
                  <p className="sub-message">Add items to your wishlist from the product pages.</p>
                </div>
              ) : (
                <div className="items-grid">
                  {wishlistItems.map((item) => (
                    <div key={item.product_id} className="item-card">
                      {imageErrors[item.product_id] ? (
                        <div className="item-image placeholder-image">
                          <FontAwesomeIcon icon={faImage} size="2x" />
                        </div>
                      ) : (
                        <img 
                          src={item.product_image} 
                          alt={item.product_title} 
                          className="item-image"
                          onError={() => handleImageError(item.product_id)}
                        />
                      )}
                      <div className="item-details">
                        <h3>{item.product_title}</h3>
                        <p className="item-price">{formatPrice(item.price)}</p>
                        <div className="item-actions">
                          <button 
                            className="add-to-cart-button"
                            onClick={() => moveToCart(item.product_id)}
                          >
                            <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                          </button>
                          <button 
                            className="remove-button"
                            onClick={() => removeFromWishlist(item.product_id)}
                          >
                            <FontAwesomeIcon icon={faTrash} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <PurchaseModal 
          show={showModal} 
          onClose={() => {
            setShowModal(false);
            clearCart();
          }} 
        />
      </div>
    </div>
  );
}

export default Dashboard;
