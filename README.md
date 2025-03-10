# Gadget Heaven✨ - E-commerce Platform

Gadget Heaven is a modern e-commerce platform for gadget enthusiasts, offering a wide range of electronic devices and accessories. This project was built using React and implements various features to provide a seamless shopping experience.

## Live Website Link
[Gadget Heaven Live Site](https://gadgetheaven.netlify.app)

## Features

1. **Responsive Design**: The website is fully responsive and works seamlessly across all device sizes.

2. **Category Filtering**: Users can browse products by categories such as computers, phones, smart watches, chargers, and power banks.

3. **Shopping Cart System**: Add products to cart, remove items, sort by price, and view total price. The cart has a maximum limit of $1000.

4. **Wishlist Management**: Save products for later, move items from wishlist to cart, and manage your wishlist items.

5. **Persistent Data**: Cart and wishlist data are stored in localStorage, ensuring data persists between sessions.

6. **Interactive UI Elements**: Toast notifications, active route indicators, and smooth animations enhance the user experience.

7. **Statistics Page**: View product prices and ratings in an interactive chart.

## React Concepts Used

- **Context API**: Used for state management of cart and wishlist functionality.
- **React Router**: Implemented for navigation between different pages.
- **Custom Hooks**: Created custom hooks for cart and wishlist functionality.
- **useEffect & useState**: Used for managing component lifecycle and state.
- **Conditional Rendering**: Applied throughout the application for dynamic content display.
- **Props & Component Composition**: Used for building reusable components.
- **React Helmet**: Implemented for dynamic page titles and SEO optimization.

## Data Management

- **Context API**: Used for managing application state (cart and wishlist).
- **localStorage**: Implemented for persisting data between sessions.
- **JSON Data**: Product data is stored in a JSON file and fetched when needed.

## Technologies Used

- React
- React Router
- React Toastify
- React Rating Stars
- FontAwesome Icons
- Recharts (for statistics visualization)
- CSS for styling

## How to Run Locally

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src/components`: Reusable UI components
- `/src/context`: Context providers for state management
- `/src/pages`: Main application pages
- `/public`: Static assets and data files

## Future Improvements

- User authentication and profile management
- Product reviews and ratings
- Advanced filtering and search functionality
- Payment gateway integration
- Order history and tracking
