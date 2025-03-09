import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptop,
  faMobile,
  faClock,
  faBolt,
  faBatteryFull,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import "./Sidebar.css";

const Sidebar = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products to extract categories
    fetch("/products.json")
      .then((response) => response.json())
      .then((data) => {
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((item) => item.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  // Map category names to icons
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "computers":
        return faLaptop;
      case "phones":
        return faMobile;
      case "smart watches":
        return faClock;
      case "chargers":
        return faBolt;
      case "power banks":
        return faBatteryFull;
      default:
        return faLaptop;
    }
  };

  return (
    <div className="sidebar">
      <h2>Categories</h2>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <ul className="category-list">
          <li
            className={selectedCategory === "all" ? "active" : ""}
            onClick={() => onCategorySelect("all")}
          >
            <span>All Products</span>
          </li>
          {categories.map((category) => (
            <li
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => onCategorySelect(category)}
            >
              <FontAwesomeIcon icon={getCategoryIcon(category)} />
              <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  onCategorySelect: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired
};

export default Sidebar;
