import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import "./Home.css";
import Banner from "../components/Banner";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products data
    fetch("/products.json")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
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
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

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
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
