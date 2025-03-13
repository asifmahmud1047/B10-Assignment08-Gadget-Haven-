import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSort, faTrash, faShoppingCart, faHeart, 
  faExclamationCircle, faImage, 
  faCheck, faInfoCircle, faArrowLeft 
} from "@fortawesome/free-solid-svg-icons";
import PurchaseModal from "../components/PurchaseModal";
import "./Dashboard.css";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabParam === 'wishlist' ? 'wishlist' : 'cart');
  const [showModal, setShowModal] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [confirmAction, setConfirmAction] = useState(null);
  const [animatingItems, setAnimatingItems] = useState({});
  const [sortDirection, setSortDirection] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  
  const { cartItems, removeFromCart, clearCart, totalPrice, sortCartByPrice } = useCart();
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();
  
  const cartRef = useRef(null);
  const wishlistRef = useRef(null);

  // Debug logs
  useEffect(() => {
    console.log("Cart Items:", cartItems);
    console.log("Wishlist Items:", wishlistItems);
  }, [cartItems, wishlistItems]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Update activeTab when URL changes
  useEffect(() => {
    if (tabParam === 'wishlist') {
      setActiveTab('wishlist');
    } else if (tabParam === 'cart') {
      setActiveTab('cart');
    }
  }, [tabParam]);

  // Update URL when tab changes
  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('tab', activeTab);
    navigate({ search: newParams.toString() }, { replace: true });
  }, [activeTab, location.search, navigate]);

  // Reset image errors when cart or wishlist items change
  useEffect(() => {
    setImageErrors({});
  }, [cartItems, wishlistItems]);

  const handlePurchase = () => {
    if (cartItems && cartItems.length > 0) {
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
    console.log("Image error for product ID:", id);
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const handleRemoveFromCart = (productId) => {
    setConfirmAction({
      type: 'removeCart',
      productId,
      title: cartItems.find(item => item.product_id === productId)?.product_title || 'this item'
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    setConfirmAction({
      type: 'removeWishlist',
      productId,
      title: wishlistItems.find(item => item.product_id === productId)?.product_title || 'this item'
    });
  };

  const handleMoveToCart = (productId) => {
    // Start animation
    setAnimatingItems(prev => ({ ...prev, [productId]: 'moving' }));
    
    // Delay the actual move to allow animation to play
    setTimeout(() => {
      moveToCart(productId);
      setAnimatingItems(prev => ({ ...prev, [productId]: false }));
    }, 500);
  };

  const handleSortCart = () => {
    const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newDirection);
    sortCartByPrice(newDirection);
  };

  const confirmActionHandler = () => {
    if (!confirmAction) return;
    
    if (confirmAction.type === 'removeCart') {
      // Start animation
      setAnimatingItems(prev => ({ ...prev, [confirmAction.productId]: 'removing' }));
      
      // Delay the actual removal to allow animation to play
      setTimeout(() => {
        removeFromCart(confirmAction.productId);
        setAnimatingItems(prev => ({ ...prev, [confirmAction.productId]: false }));
      }, 500);
    } else if (confirmAction.type === 'removeWishlist') {
      // Start animation
      setAnimatingItems(prev => ({ ...prev, [confirmAction.productId]: 'removing' }));
      
      // Delay the actual removal to allow animation to play
      setTimeout(() => {
        removeFromWishlist(confirmAction.productId);
        setAnimatingItems(prev => ({ ...prev, [confirmAction.productId]: false }));
      }, 500);
    }
    
    setConfirmAction(null);
  };

  const cancelActionHandler = () => {
    setConfirmAction(null);
  };

  const getItemClassName = (itemId) => {
    if (!animatingItems[itemId]) return "item-card";
    
    if (animatingItems[itemId] === 'removing') {
      return "item-card item-removing";
    } else if (animatingItems[itemId] === 'moving') {
      return "item-card item-moving";
    }
    
    return "item-card";
  };

  // Ensure image path is correct
  const getImagePath = (imagePath) => {
    if (!imagePath) return null;
    
    // If the path already starts with http or https, return it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If the path doesn't start with a slash, add one
    if (!imagePath.startsWith('/')) {
      return `/${imagePath}`;
    }
    
    return imagePath;
  };

  if (isLoading) {
    return (
      <div className="dashboard loading-state">
        <div className="dashboard-container">
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faInfoCircle} spin size="3x" />
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

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
            {cartItems && cartItems.length > 0 && (
              <span className="item-count">{cartItems.length}</span>
            )}
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
            className={activeTab === "wishlist" ? "tab-button active" : "tab-button"}
        >
            <FontAwesomeIcon icon={faHeart} /> Wishlist
            {wishlistItems && wishlistItems.length > 0 && (
              <span className="item-count">{wishlistItems.length}</span>
            )}
        </button>
      </div>
        
      <div className="tab-content">
        {activeTab === "cart" ? (
            <div className="cart-tab" ref={cartRef}>
              <div className="tab-header">
                <h2>Your Cart Items</h2>
                <div className="tab-actions">
                  <button 
                    className="sort-button"
                    onClick={handleSortCart}
                    disabled={!cartItems || cartItems.length <= 1}
                    title={`Sort by price (${sortDirection === 'desc' ? 'high to low' : 'low to high'})`}
                  >
                    <FontAwesomeIcon icon={faSort} /> 
                    Sort by Price {sortDirection === 'desc' ? '(High to Low)' : '(Low to High)'}
                  </button>
                  <div className="total-price">
                    Total: {formatPrice(totalPrice())}
                  </div>
                </div>
              </div>
              
              {!cartItems || cartItems.length === 0 ? (
                <div className="empty-message">
                  <FontAwesomeIcon icon={faExclamationCircle} size="2x" />
                  <p>Your cart is empty.</p>
                  <p className="sub-message">Add items from the product pages or your wishlist.</p>
                  {wishlistItems && wishlistItems.length > 0 && (
                    <button 
                      className="suggestion-button"
                      onClick={() => setActiveTab('wishlist')}
                    >
                      <FontAwesomeIcon icon={faHeart} /> Check your wishlist
                    </button>
                  )}
                </div>
              ) : (
                <div className="items-grid">
                  {cartItems.map((item) => (
                    <div 
                      key={item.product_id} 
                      className={getItemClassName(item.product_id)}
                      data-id={item.product_id}
                    >
                      {imageErrors[item.product_id] ? (
                        <div className="item-image placeholder-image">
                          <FontAwesomeIcon icon={faImage} size="2x" />
                          <p>{item.product_title || "Product"}</p>
                        </div>
                      ) : (
                        <img 
                          src={getImagePath(item.product_image)}
                          alt={item.product_title || "Product"} 
                          className="item-image"
                          onError={() => handleImageError(item.product_id)}
                        />
                      )}
                      <div className="item-details">
                        <h3>{item.product_title || "Unknown Product"}</h3>
                        <p className="item-price">{formatPrice(item.price || 0)}</p>
                        <button 
                          className="remove-button"
                          onClick={() => handleRemoveFromCart(item.product_id)}
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
                  disabled={!cartItems || cartItems.length === 0}
                  onClick={handlePurchase}
                >
                  <FontAwesomeIcon icon={faCheck} /> Purchase
                </button>
              </div>
            </div>
          ) : (
            <div className="wishlist-tab" ref={wishlistRef}>
              <div className="tab-header">
                <h2>Your Wishlist</h2>
                {wishlistItems && wishlistItems.length > 0 && (
                  <div className="tab-actions">
                    <span className="wishlist-count">
                      {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                )}
              </div>
              
              {!wishlistItems || wishlistItems.length === 0 ? (
                <div className="empty-message">
                  <FontAwesomeIcon icon={faExclamationCircle} size="2x" />
                  <p>Your wishlist is empty.</p>
                  <p className="sub-message">Add items to your wishlist from the product pages.</p>
                  <button 
                    className="suggestion-button"
                    onClick={() => navigate('/')}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} /> Browse products
                  </button>
                </div>
              ) : (
                <div className="items-grid">
                  {wishlistItems.map((item) => (
                    <div 
                      key={item.product_id} 
                      className={getItemClassName(item.product_id)}
                      data-id={item.product_id}
                    >
                      {imageErrors[item.product_id] ? (
                        <div className="item-image placeholder-image">
                          <FontAwesomeIcon icon={faImage} size="2x" />
                          <p>{item.product_title || "Product"}</p>
                        </div>
                      ) : (
                        <img 
                          src={getImagePath(item.product_image)}
                          alt={item.product_title || "Product"} 
                          className="item-image"
                          onError={() => handleImageError(item.product_id)}
                        />
                      )}
                      <div className="item-details">
                        <h3>{item.product_title || "Unknown Product"}</h3>
                        <p className="item-price">{formatPrice(item.price || 0)}</p>
                        <div className="item-actions">
                          <button 
                            className="add-to-cart-button"
                            onClick={() => handleMoveToCart(item.product_id)}
                          >
                            <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                          </button>
                          <button 
                            className="remove-button"
                            onClick={() => handleRemoveFromWishlist(item.product_id)}
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
        
        {/* Confirmation Dialog */}
        {confirmAction && (
          <div className="confirmation-dialog">
            <div className="confirmation-content">
              <h3>Confirm Action</h3>
              <p>Are you sure you want to remove <strong>{confirmAction.title}</strong>?</p>
              <div className="confirmation-buttons">
                <button className="cancel-button" onClick={cancelActionHandler}>
                  Cancel
                </button>
                <button className="confirm-button" onClick={confirmActionHandler}>
                  <FontAwesomeIcon icon={faCheck} /> Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        
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
