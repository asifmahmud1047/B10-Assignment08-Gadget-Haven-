import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from "recharts";
import "./Stats.css";

const Stats = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products data
    fetch("/products.json")
      .then((response) => response.json())
      .then((data) => {
        // Format data for the chart
        const formattedData = data.map((product) => ({
          name: product.product_title.length > 10 
            ? product.product_title.substring(0, 10) + "..." 
            : product.product_title,
          price: product.price,
          rating: product.rating * 20, // Scale rating for better visualization
        }));
        setProducts(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="stats-container">
      <Helmet>
        <title>Gadget Heaven - Statistics</title>
      </Helmet>
      <h1>Product Statistics</h1>
      <p>This chart shows the price and rating distribution of our products.</p>
      
      {loading ? (
        <div className="loading">Loading statistics...</div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={products}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" scale="band" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="price" fill="#8884d8" stroke="#8884d8" />
              <Bar dataKey="price" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="price" stroke="#ff7300" />
              <Scatter dataKey="rating" fill="red" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Stats; 