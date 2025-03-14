import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faImage } from "@fortawesome/free-solid-svg-icons";
import StarRating from "./StarRating";
import PropTypes from "prop-types";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLaptop, setIsLaptop] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width <= 991);
      setIsLaptop(width >= 992 && width <= 1399);
    };
    
    checkDeviceType();
    
    window.addEventListener('resize', checkDeviceType);
    
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

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

    
    const timeoutId = setTimeout(() => {
      if (!imageLoaded && !imageError) {
        console.warn(`Image loading timeout for product: ${product.product_title}`);
        setImageError(true);
      }
    }, 3000); 

    return () => {
      clearTimeout(timeoutId);
    };
  }, [product.product_image, product.product_id, product.product_title, imageLoaded, isImageVisible]);

  const getCategoryClass = (category) => {
    const formattedCategory = category.replace(/\s+/g, '-').toLowerCase();
    return `category-${formattedCategory}`;
  };

  const getImagePath = (imagePath) => {
    if (!imagePath) return null;
    

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    
    if (!imagePath.startsWith('/')) {
      return `/${imagePath}`;
    }
    
    return imagePath;
  };

  
  const formatPrice = (price) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  
  const getTruncatedTitle = (title) => {
    if (isTablet && title.length > 40) {
      return title.substring(0, 40) + '...';
    } else if (isLaptop && title.length > 60) {
      return title.substring(0, 60) + '...';
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
            <FontAwesomeIcon 
              icon={faImage} 
              size={isTablet ? "2x" : isLaptop ? "3x" : "2x"} 
              color="#666"
            />
            <p>{getTruncatedTitle(product.product_title)}</p>
          </div>
        ) : (
          <>
            {isImageVisible && (
              <img
                src={getImagePath(product.product_image)}
        alt={product.product_title}
        className="product-image"
                onError={() => setImageError(true)}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
                style={{ 
                  opacity: imageLoaded ? 1 : 0, 
                  transition: 'opacity 0.3s ease',
                  transform: isTablet ? 'scale(1.02)' : isLaptop ? 'scale(1.02)' : 'none'
                }}
              />
            )}
            {(!imageLoaded || !isImageVisible) && !imageError && (
              <div className={`image-placeholder ${getCategoryClass(product.category)}`}>
                <FontAwesomeIcon 
                  icon={faInfoCircle} 
                  spin 
                  size={isTablet ? "2x" : isLaptop ? "3x" : "2x"} 
                  color="#3498db"
                />
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
          <StarRating
            count={5}
            value={product.rating}
            size={isTablet ? 20 : isLaptop ? 24 : 18}
            edit={false}
            activeColor="#ffd700"
          />
          <span>({product.rating})</span>
        </div>
        
        <p className="product-price">{formatPrice(product.price)}</p>
        
      <Link to={`/details/${product.product_id}`} className="details-button">
          <FontAwesomeIcon icon={faInfoCircle} size={isTablet || isLaptop ? "1x" : "sm"} /> 
          {isTablet ? "View Details" : isLaptop ? "View Details" : "View Details"}
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
