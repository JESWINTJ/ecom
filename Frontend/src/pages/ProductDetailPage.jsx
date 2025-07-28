import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import Header from '../components/layout/Header.jsx';
// import Footer from '../components/layout/Footer.jsx';
import { FiStar } from 'react-icons/fi'; // Import FiStar for rating display

function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Ensure that the data received from the backend matches the expected fields
        // If your backend Product model has 'rating' and 'numReviews', they will be used.
        // Otherwise, you might need to add dummy values or adjust display.
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch product details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]); // Rerun effect if productId changes

  const handleAddToCart = () => {
    if (product) {
      console.log('Adding to cart:', product.name);
      // Pass the entire fetched product object to the cart page
      navigate('/cart', { state: { product: product } });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      console.log('Buying now:', product.name);
      // Pass the entire fetched product object to the checkout page
      // Assuming a default quantity of 1 for direct buy
      navigate('/checkout', { state: { cartData: { ...product, quantity: 1 }, totalAmount: parseFloat(product.amount) } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Error: {error}. Product not found or invalid ID.
        <button onClick={() => navigate('/')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Back to Home</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Product not found.
        <button onClick={() => navigate('/')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* <Header /> */}

      {/* Main Content Area - Product Details */}
      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row items-start md:items-stretch gap-8">
        {/* Product Image and Action Buttons */}
        <div className="flex flex-col items-center md:w-1/3 p-4 bg-white rounded-xl shadow-lg">
          <img
            src={product.product_image} // Use product_image from DB
            alt={product.name}
            className="max-w-full h-auto rounded-lg mb-6 border border-gray-200"
          />
          <button
            onClick={handleAddToCart}
            className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg text-lg mb-4 hover:bg-yellow-500 transition duration-300 shadow-md"
          >
            add to cart
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full bg-yellow-200 text-gray-800 font-semibold py-3 px-6 rounded-lg text-lg hover:bg-yellow-300 transition duration-300 shadow-md"
          >
            buy now
          </button>
        </div>

        {/* Product Details */}
        <div className="flex-grow p-4 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl font-medium text-gray-800 mb-2">{product.name}</h1>
          <p className="text-gray-600 text-sm mb-2">{product.details}</p> {/* Use product.details from DB */}
          <div className="flex items-center mb-4">
            {/* Assuming 'rating' and 'numReviews' are still present in your DB product */}
            {/* If your DB product doesn't have these, they won't display */}
            {product.rating !== undefined && product.numReviews !== undefined && (
              <>
                <span className="bg-green-500 text-white text-sm px-2 py-0.5 rounded-md mr-2 flex items-center">
                  {product.rating.toFixed(1)} {/* Display rating with one decimal */}
                  <FiStar className="w-3 h-3 ml-1 fill-current" /> {/* Using FiStar from react-icons */}
                </span>
                <span className="text-gray-600 text-sm">{product.numReviews} Reviews</span>
              </>
            )}
          </div>

          <div className="flex items-baseline mb-4">
            <span className="text-3xl font-bold text-gray-900 mr-2">₹{parseFloat(product.amount)}</span> {/* Use product.amount from DB */}
            {/* If you have originalPrice and discount in your DB products, add them here */}
            {/* Example: product.originalPrice && (
              <span className="text-lg text-gray-500 line-through mr-2">₹{product.originalPrice}</span>
            )}
            {product.discount && (
              <span className="text-lg text-green-600 font-semibold">{product.discount}% off</span>
            )*/}
          </div>

          <p className="text-gray-700 text-sm mb-4">
            Stock: <span className="font-semibold">{product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}</span> {/* Use product.stock from DB */}
          </p>
          {product.available !== undefined && (
            <p className="text-gray-700 text-sm mb-2">
              Availability: <span className="font-semibold">{product.available ? 'Available' : 'Not Available'}</span>
            </p>
          )}
          {product.brand && (
            <p className="text-gray-700 text-sm mb-2">
              Brand: <span className="font-semibold">{product.brand}</span>
            </p>
          )}
          {/* You can display addedAt, modifiedAt, sellerRef if needed */}
          {product.addedAt && (
            <p className="text-gray-700 text-sm mb-2">
              Added On: <span className="font-semibold">{new Date(product.addedAt).toLocaleDateString()}</span>
            </p>
          )}
        </div>
      </main>
{/* 
      <Footer /> */}
    </div>
  );
}

export default ProductDetailPage;
