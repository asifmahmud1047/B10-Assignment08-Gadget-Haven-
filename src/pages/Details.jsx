import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-rating-stars-component";
import "./Details.css";

function Details() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();

  useEffect(() => {
    // Fetch product data
    fetch("/products.json")
      .then((response) => response.json())
      .then((data) => {
        const foundProduct = data.find(
          (item) => item.product_id === parseInt(id)
        );
        setProduct(foundProduct);
        setLoading(false);
        
        // Check if product is already in wishlist
        const isInWishlist = wishlistItems.some(
          (item) => item.product_id === parseInt(id)
        );
        setInWishlist(isInWishlist);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id, wishlistItems]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handleAddToWishlist = () => {
    if (product && !inWishlist) {
      addToWishlist(product);
      setInWishlist(true);
    }
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="details-container">
      <Helmet>
        <title>GadgetHaven - {product.product_title}</title>
      </Helmet>
      <div className="product-details">
        <div className="product-image-container">
          <img
            src={product.product_image}
            alt={product.product_title}
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h1 className="product-title">{product.product_title}</h1>
          
          <div className="product-rating">
            <ReactStars
              count={5}
              value={product.rating}
              size={24}
              edit={false}
              activeColor="#ffd700"
            />
            <span>({product.rating})</span>
          </div>
          
          <p className="product-price">${product.price}</p>
          
          <div className="product-availability">
            {product.availability ? (
              <span className="in-stock">In Stock</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          
          <p className="product-description">{product.description}</p>
          
          <div className="product-specifications">
            <h3>Specifications:</h3>
            <ul>
              {product.specifications.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>
          
          <div className="product-actions">
            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={!product.availability}
            >
              <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
            </button>
            <button
              className={`wishlist-button ${inWishlist ? "in-wishlist" : ""}`}
              onClick={handleAddToWishlist}
              disabled={inWishlist}
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
