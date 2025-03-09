import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-rating-stars-component";
import PropTypes from "prop-types";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.product_image}
          alt={product.product_title}
          className="product-image"
        />
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
    price: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    availability: PropTypes.bool.isRequired
  }).isRequired
};

export default ProductCard;
