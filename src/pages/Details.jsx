import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHeart, faInfoCircle, faImage, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";
import "./Details.css";

function Details() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();

  // Check if device is tablet
  useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width <= 991);
    };
    
    // Initial check
    checkTablet();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkTablet);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
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

  // Preload image to check if it exists
  useEffect(() => {
    if (product && product.product_image) {
      // Set a small timeout to prioritize page layout before loading image
      const timeoutId = setTimeout(() => {
        const img = new Image();
        img.src = product.product_image;
        
        img.onload = () => {
          setImageLoaded(true);
          setImageError(false);
        };
        
        img.onerror = () => {
          console.error(`Error loading image for product: ${product.product_title} (ID: ${product.product_id})`);
          console.error(`Image path that failed: ${product.product_image}`);
          setImageError(true);
        };
      }, 100);

      // Set a timeout to show placeholder if image takes too long to load
      const loadTimeoutId = setTimeout(() => {
        if (!imageLoaded && !imageError) {
          console.warn(`Image loading timeout for product: ${product.product_title}`);
          setImageError(true);
        }
      }, 3000); // 3 seconds timeout (reduced from 5)

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(loadTimeoutId);
      };
    }
  }, [product, imageLoaded, imageError]);

  const getCategoryClass = (category) => {
    const formattedCategory = category.replace(/\s+/g, '-').toLowerCase();
    return `category-${formattedCategory}`;
  };

  // Format price with commas for thousands
  const formatPrice = (price) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  // Format specifications for tablet view
  const getFormattedSpecs = (specs) => {
    if (isTablet) {
      // For tablet, limit to 3 specs max and truncate if too long
      return specs.slice(0, 3).map(spec => 
        spec.length > 60 ? spec.substring(0, 60) + '...' : spec
      );
    }
    return specs;
  };

  // Format description for tablet view
  const getFormattedDescription = (description) => {
    if (isTablet && description.length > 150) {
      return description.substring(0, 150) + '...';
    }
    return description;
  };

  const handleAddToCart = () => {
    if (product) {
      try {
        console.log("Adding product to cart from Details page:", product);
        
        // Make sure the product has all required fields
        const productToAdd = {
          product_id: parseInt(product.product_id),
          product_title: product.product_title,
          product_image: product.product_image,
          price: parseFloat(product.price),
          category: product.category
        };
        
        console.log("Formatted product for cart:", productToAdd);
        const success = addToCart(productToAdd);
        
        if (success) {
          console.log("Product successfully added to cart");
        } else {
          console.log("Failed to add product to cart");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart. Please try again.");
      }
    } else {
      toast.error("Product information not available. Please try again later.");
    }
  };

  const handleAddToWishlist = () => {
    if (product && !inWishlist) {
      try {
        console.log("Adding product to wishlist from Details page:", product);
        
        // Make sure the product has all required fields
        const productToAdd = {
          product_id: parseInt(product.product_id),
          product_title: product.product_title,
          product_image: product.product_image,
          price: parseFloat(product.price),
          category: product.category
        };
        
        console.log("Formatted product for wishlist:", productToAdd);
        const success = addToWishlist(productToAdd);
        
        if (success) {
          console.log("Product successfully added to wishlist");
          setInWishlist(true);
        } else {
          console.log("Failed to add product to wishlist");
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        toast.error("Failed to add item to wishlist. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <FontAwesomeIcon icon={faInfoCircle} spin size={isTablet ? "2x" : "2x"} style={{ marginRight: '10px' }} />
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="details-container">
      <Helmet>
        <title>Gadget Heaven - {product.product_title}</title>
      </Helmet>
      <div className="product-details">
        <div className="product-image-container">
          {imageError ? (
            <div 
              className={`details-image-placeholder ${getCategoryClass(product.category)}`}
            >
              <FontAwesomeIcon icon={faImage} size={isTablet ? "3x" : "3x"} />
              <p>{isTablet && product.product_title.length > 30 
                ? product.product_title.substring(0, 30) + '...' 
                : product.product_title}</p>
            </div>
          ) : (
            <>
              <img
                src={product.product_image}
                alt={product.product_title}
                className="product-image"
                onError={() => setImageError(true)}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
                style={{ 
                  opacity: imageLoaded ? 1 : 0, 
                  transition: 'opacity 0.5s ease',
                  transform: isTablet ? 'scale(1.05)' : 'none' // Slightly larger images on tablet
                }}
              />
              {!imageLoaded && !imageError && (
                <div className={`details-image-placeholder ${getCategoryClass(product.category)}`}>
                  <FontAwesomeIcon icon={faInfoCircle} spin size={isTablet ? "3x" : "3x"} />
                  <p>Loading product image...</p>
                </div>
              )}
            </>
          )}
        </div>
        <div className="product-info">
          <h1 className="product-title">
            {isTablet && product.product_title.length > 40 
              ? product.product_title.substring(0, 40) + '...' 
              : product.product_title}
          </h1>
          
          <div className="product-rating">
            <ReactStars
              count={5}
              value={product.rating}
              size={isTablet ? 22 : 24}
              edit={false}
              activeColor="#ffd700"
            />
            <span>({product.rating})</span>
          </div>
          
          <p className="product-price">{formatPrice(product.price)}</p>
          
          <div className="product-availability">
            {product.availability ? (
              <span className="in-stock">
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '5px' }} />
                In Stock
              </span>
            ) : (
              <span className="out-of-stock">
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '5px' }} />
                Out of Stock
              </span>
            )}
          </div>
          
          <p className="product-description">{getFormattedDescription(product.description)}</p>
          
          <div className="product-specifications">
            <h3>Specifications:</h3>
            <ul>
              {getFormattedSpecs(product.specifications).map((spec, index) => (
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
              <FontAwesomeIcon icon={faShoppingCart} /> {isTablet ? "Add to Cart" : "Add to Cart"}
            </button>
            <button
              className={`wishlist-button ${inWishlist ? "in-wishlist" : ""}`}
              onClick={handleAddToWishlist}
              disabled={inWishlist}
              title={inWishlist ? "Already in wishlist" : "Add to wishlist"}
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
