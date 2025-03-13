import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
  Label
} from "recharts";
import "./Stats.css";

const Stats = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products data
    fetch("/products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products data");
        }
        return response.json();
      })
      .then((data) => {
        // Format data for the chart
        const formattedData = data.map((product) => ({
          x: product.price, // Price on X-axis
          y: product.rating, // Rating on Y-axis
          z: 200, // Size of the dot
          name: product.product_title,
          category: product.category,
        }));
        setProducts(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Custom tooltip to display product details on hover
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-name">{data.name}</p>
          <p className="tooltip-price">Price: ${data.x}</p>
          <p className="tooltip-rating">Rating: {data.y}/5</p>
          <p className="tooltip-category">Category: {data.category}</p>
        </div>
      );
    }
    return null;
  };

  // Add PropTypes for CustomTooltip
  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        payload: PropTypes.shape({
          name: PropTypes.string,
          x: PropTypes.number,
          y: PropTypes.number,
          category: PropTypes.string
        })
      })
    )
  };

  return (
    <div className="stats-container">
      <Helmet>
        <title>Gadget Heaven - Statistics</title>
      </Helmet>
      <h1>Product Price vs. Rating Analysis</h1>
      <p>This chart shows the relationship between product prices and their ratings.</p>
      
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading statistics...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Error: {error}</p>
          <p>Please try refreshing the page.</p>
        </div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 60,
                left: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Price" 
                unit="$"
                domain={['dataMin - 50', 'dataMax + 50']}
              >
                <Label value="Price ($)" position="bottom" offset={20} />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Rating" 
                domain={[0, 5]}
                tickCount={6}
              >
                <Label value="Rating" angle={-90} position="left" offset={-20} />
              </YAxis>
              <ZAxis type="number" dataKey="z" range={[100, 500]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Scatter 
                name="Products" 
                data={products} 
                fill="#8884d8" 
                shape="circle"
                strokeWidth={1}
                stroke="#8884d8"
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="chart-explanation">
            <h3>Understanding the Chart</h3>
            <p>Each dot represents a product. The horizontal position shows the price, while the vertical position shows the rating (from 0 to 5 stars).</p>
            <p>Hover over any dot to see detailed information about that product.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats; 