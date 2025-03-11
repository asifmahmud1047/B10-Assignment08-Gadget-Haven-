import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faImage } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-rating-stars-component";
import PropTypes from "prop-types";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);

  // Check device type
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width <= 991);
      setIsLaptop(width >= 992 && width <= 1399);
    };
    
    // Initial check
    checkDeviceType();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkDeviceType);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  // Use Intersection Observer to load images only when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsImageVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = document.getElementById(`product-card-${product.product_id}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [product.product_id]);

  // Preload image to check if it exists
  useEffect(() => {
    if (!isImageVisible) return;

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

    // Set a timeout to show placeholder if image takes too long to load
    const timeoutId = setTimeout(() => {
      if (!imageLoaded && !imageError) {
        console.warn(`Image loading timeout for product: ${product.product_title}`);
        setImageError(true);
      }
    }, 3000); // 3 seconds timeout

    return () => {
      clearTimeout(timeoutId);
    };
  }, [product.product_image, product.product_id, product.product_title, imageLoaded, isImageVisible]);

  // Get CSS class for category
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

  // Truncate title based on device type
  const getTruncatedTitle = (title) => {
    if (isTablet && title.length > 35) {
      return title.substring(0, 35) + '...';
    } else if (isLaptop && title.length > 50) {
      return title.substring(0, 50) + '...';
    }
    return title;
  };

  return (
    <div className="product-card" id={`product-card-${product.product_id}`}>
      <div className="product-image-container">
        {imageError ? (
          <div 
            className={`image-placeholder ${getCategoryClass(product.category)}`}
          >
            <FontAwesomeIcon icon={faImage} size={isTablet ? "2x" : isLaptop ? "3x" : "2x"} />
            <p>{getTruncatedTitle(product.product_title)}</p>
          </div>
        ) : (
          <>
            {isImageVisible && (
              <img
                src={product.product_image}
                alt={product.product_title}
                className="product-image"
                onError={() => setImageError(true)}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
                style={{ 
                  opacity: imageLoaded ? 1 : 0, 
                  transition: 'opacity 0.3s ease',
                  transform: isTablet ? 'scale(1.05)' : isLaptop ? 'scale(1.02)' : 'none'
                }}
              />
            )}
            {(!imageLoaded || !isImageVisible) && !imageError && (
              <div className={`image-placeholder ${getCategoryClass(product.category)}`}>
                <FontAwesomeIcon icon={faInfoCircle} spin size={isTablet ? "2x" : isLaptop ? "3x" : "2x"} />
                <p>Loading...</p>
              </div>
            )}
          </>
        )}
        {!product.availability && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{getTruncatedTitle(product.product_title)}</h3>
        
        <div className="product-rating">
          <ReactStars
            count={5}
            value={product.rating}
            size={isTablet ? 18 : isLaptop ? 20 : 18}
            edit={false}
            activeColor="#ffd700"
          />
          <span>({product.rating})</span>
        </div>
        
        <p className="product-price">{formatPrice(product.price)}</p>
        
        <Link to={`/details/${product.product_id}`} className="details-button">
          <FontAwesomeIcon icon={faInfoCircle} /> {isTablet ? "View" : "View Details"}
        </Link>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    product_id: PropTypes.number.isRequired,
    product_title: PropTypes.string.isRequired,
    product_image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    availability: PropTypes.bool.isRequired
  }).isRequired
};

export default ProductCard;
