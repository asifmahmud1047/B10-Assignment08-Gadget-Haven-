import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import "./Stats.css";

const Stats = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState("bar");

  useEffect(() => {
    fetch("/products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched products:", data.length);
        
        const ratingGroups = {};
        data.forEach(product => {
          const rating = product.rating.toFixed(1);
          if (!ratingGroups[rating]) {
            ratingGroups[rating] = {
              rating: parseFloat(rating),
              count: 0,
              avgPrice: 0,
              totalPrice: 0
            };
          }
          ratingGroups[rating].count += 1;
          ratingGroups[rating].totalPrice += product.price;
        });
        
        const barData = Object.values(ratingGroups).map(group => ({
          rating: group.rating,
          avgPrice: group.totalPrice / group.count,
          count: group.count
        }));
        
        // Sort by rating
        barData.sort((a, b) => a.rating - b.rating);
        setBarChartData(barData);
        
        const scatterChartData = data.map((product) => ({
          x: product.price,
          y: product.rating,
          z: 200,
          name: product.product_title,
          category: product.category,
        }));
        setScatterData(scatterChartData);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const BarChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">Rating: {data.rating}</p>
          <p className="tooltip-price">Average Price: ${data.avgPrice.toFixed(2)}</p>
          <p className="tooltip-count">Products: {data.count}</p>
        </div>
      );
    }
    return null;
  };


  const ScatterChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-name">{data.name}</p>
          <p className="tooltip-price">Price: ${data.x.toFixed(2)}</p>
          <p className="tooltip-rating">Rating: {data.y}/5</p>
          <p className="tooltip-category">Category: {data.category}</p>
        </div>
      );
    }
    return null;
  };


  BarChartTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        payload: PropTypes.shape({
          rating: PropTypes.number,
          avgPrice: PropTypes.number,
          count: PropTypes.number
        })
      })
    )
  };

  ScatterChartTooltip.propTypes = {
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
      
      <div className="chart-selector">
        <button 
          className={activeChart === "bar" ? "active" : ""} 
          onClick={() => setActiveChart("bar")}
        >
          Price-Rating Bar Chart
        </button>
        <button 
          className={activeChart === "scatter" ? "active" : ""} 
          onClick={() => setActiveChart("scatter")}
        >
          Price-Rating Scatter Plot
        </button>
      </div>
      
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
          {activeChart === "bar" ? (
            <>
              <h2>Average Price by Rating</h2>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={barChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 60,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="rating" 
                    label={{ 
                      value: 'Rating', 
                      position: 'bottom', 
                      offset: 20 
                    }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Average Price ($)', 
                      angle: -90, 
                      position: 'left', 
                      offset: -40 
                    }}
                  />
                  <Tooltip content={<BarChartTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="avgPrice" 
                    name="Average Price" 
                    fill="#8884d8" 
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-explanation">
                <h3>Understanding the Bar Chart</h3>
                <p>This chart shows the average price of products for each rating level. Higher bars indicate higher average prices.</p>
                <p>Hover over any bar to see detailed information about that rating group.</p>
              </div>
            </>
          ) : (
            <>
              <h2>Price vs. Rating Scatter Plot</h2>
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
                  <Tooltip content={<ScatterChartTooltip />} />
                  <Legend />
                  <Scatter 
                    name="Products" 
                    data={scatterData} 
                    fill="#8884d8" 
                    shape="circle"
                    strokeWidth={1}
                    stroke="#8884d8"
                  />
                </ScatterChart>
              </ResponsiveContainer>
              <div className="chart-explanation">
                <h3>Understanding the Scatter Plot</h3>
                <p>Each dot represents a product. The horizontal position shows the price, while the vertical position shows the rating (from 0 to 5 stars).</p>
                <p>Hover over any dot to see detailed information about that product.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Stats; 