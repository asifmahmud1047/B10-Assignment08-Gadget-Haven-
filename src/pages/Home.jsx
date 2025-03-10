import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import Banner from "../components/Banner";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products data
    fetch("/products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched products:", data.length);
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filter products based on selected category
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === selectedCategory
      );
      console.log(`Filtered products for category "${selectedCategory}":`, filtered.length);
      setFilteredProducts(filtered);
    }
    // Reset visible products count when category changes
    setVisibleProducts(6);
  }, [selectedCategory, products]);

  const handleCategorySelect = (category) => {
    console.log("Selected category:", category);
    setSelectedCategory(category);
  };

  const handleViewMore = () => {
    setVisibleProducts(prevCount => prevCount + 6);
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Products</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Helmet>
        <title>GadgetHaven - Your go-to destination for the latest gadgets</title>
        <meta name="description" content="Discover the latest and greatest gadgets at GadgetHaven. Shop computers, phones, smart watches, and more." />
      </Helmet>
      
      <Banner />
      
      <div className="content-container">
        <Sidebar 
          onCategorySelect={handleCategorySelect} 
          selectedCategory={selectedCategory} 
        />
        
        <div className="products-container">
          <h2 className="category-title">
            {selectedCategory === "all" 
              ? "All Products" 
              : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </h2>
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              No products found in this category.
            </div>
          ) : (
            <>
              <div className="products-grid">
                {filteredProducts.slice(0, visibleProducts).map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
              
              {visibleProducts < filteredProducts.length && (
                <div className="view-more-container">
                  <button 
                    className="view-more-button"
                    onClick={handleViewMore}
                  >
                    View More <FontAwesomeIcon icon={faArrowDown} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
