import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faTrash, faShoppingCart, faHeart } from "@fortawesome/free-solid-svg-icons";
import PurchaseModal from "../components/PurchaseModal";
import "./Dashboard.css";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("cart");
  const [showModal, setShowModal] = useState(false);
  const { cartItems, removeFromCart, clearCart, totalPrice, sortCartByPrice } = useCart();
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();

  const handlePurchase = () => {
    if (cartItems.length > 0) {
      setShowModal(true);
    }
  };

  return (
    <div className="dashboard-container">
      <Helmet>
        <title>GadgetHaven - Dashboard</title>
      </Helmet>
      <h1>Your Dashboard</h1>
      
      <div className="tabs">
        <button
          onClick={() => setActiveTab("cart")}
          className={activeTab === "cart" ? "tab-button active" : "tab-button"}
        >
          <FontAwesomeIcon icon={faShoppingCart} /> Cart
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
          className={activeTab === "wishlist" ? "tab-button active" : "tab-button"}
        >
          <FontAwesomeIcon icon={faHeart} /> Wishlist
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
                >
                  <FontAwesomeIcon icon={faSort} /> Sort by Price
                </button>
                <div className="total-price">
                  Total: ${totalPrice()}
                </div>
              </div>
            </div>
            
            {cartItems.length === 0 ? (
              <p className="empty-message">Your cart is empty.</p>
            ) : (
              <div className="items-grid">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="item-card">
                    <img 
                      src={item.product_image} 
                      alt={item.product_title} 
                      className="item-image"
                    />
                    <div className="item-details">
                      <h3>{item.product_title}</h3>
                      <p className="item-price">${item.price}</p>
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
              <p className="empty-message">Your wishlist is empty.</p>
            ) : (
              <div className="items-grid">
                {wishlistItems.map((item) => (
                  <div key={item.product_id} className="item-card">
                    <img 
                      src={item.product_image} 
                      alt={item.product_title} 
                      className="item-image"
                    />
                    <div className="item-details">
                      <h3>{item.product_title}</h3>
                      <p className="item-price">${item.price}</p>
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
  );
}

export default Dashboard;
