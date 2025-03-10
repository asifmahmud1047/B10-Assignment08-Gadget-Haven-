import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-rating-stars-component";
import PropTypes from "prop-types";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error(`Error loading image for product: ${product.product_title} (ID: ${product.product_id})`);
    console.error(`Image path that failed: ${product.product_image}`);
    setImageError(true);
  };

  // Get CSS class for category
  const getCategoryClass = (category) => {
    const formattedCategory = category.replace(/\s+/g, '-').toLowerCase();
    return `category-${formattedCategory}`;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {imageError ? (
          <div 
            className={`image-placeholder ${getCategoryClass(product.category)}`}
          >
            <FontAwesomeIcon icon={faInfoCircle} size="3x" />
            <p>{product.product_title}</p>
          </div>
        ) : (
          <img
            src={product.product_image}
            alt={product.product_title}
            className="product-image"
            onError={handleImageError}
            loading="lazy"
          />
        )}
        {!product.availability && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{product.product_title}</h3>
        
        <div className="product-rating">
          <ReactStars
            count={5}
            value={product.rating}
            size={18}
            edit={false}
            activeColor="#ffd700"
          />
          <span>({product.rating})</span>
        </div>
        
        <p className="product-price">${product.price}</p>
        
        <Link to={`/details/${product.product_id}`} className="details-button">
          <FontAwesomeIcon icon={faInfoCircle} /> Details
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
