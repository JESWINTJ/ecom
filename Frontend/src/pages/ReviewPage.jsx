import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import { FiStar } from 'react-icons/fi'; // Import FiStar for rating display

function ReviewPage() {
  const navigate = useNavigate();
  const { productId: paramProductId } = useParams(); // Get product ID from URL params
  const location = useLocation(); // Hook to access navigation state

  // Product data for the review, prioritized from location.state, then URL params
  const [productToReview, setProductToReview] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(null);

  const [rating, setRating] = useState(0); // State for selected star rating (frontend)
  const [reviewText, setReviewText] = useState(''); // State for review text (frontend)
  const [message, setMessage] = useState(''); // Message for review submission

  useEffect(() => {
    const fetchProductDetails = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          // If response is not OK, it might be HTML, so don't try to parse as JSON
          const errorText = await response.text(); // Read as text to see content
          throw new Error(`HTTP error! status: ${response.status} - ${errorText.substring(0, 100)}...`); // Show part of error text
        }
        const data = await response.json();
        setProductToReview(data);
      } catch (err) {
        setProductError(err.message);
        console.error("Failed to fetch product details for review:", err);
      } finally {
        setLoadingProduct(false);
      }
    };

    // If product is passed directly from OrderConfirmationPage
    if (location.state && location.state.orderedProduct) {
      setProductToReview(location.state.orderedProduct);
      setLoadingProduct(false);
    } else if (paramProductId) {
      // If navigated directly to /review/:productId, fetch product details
      fetchProductDetails(paramProductId);
    } else {
      // No product ID provided
      setProductError('No product specified for review.');
      setLoadingProduct(false);
    }
  }, [paramProductId, location.state]); // Re-run if params or location state changes

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setMessage('Please select a star rating.');
      return;
    }
    if (!reviewText.trim()) {
      setMessage('Please enter your review.');
      return;
    }
    if (!productToReview || !productToReview._id) {
      setMessage('Cannot submit review: Product information is missing.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get the JWT token from local storage after login
      if (!token) {
        setMessage('You must be logged in to submit a review.');
        console.warn('No token found. User might not be logged in.');
        navigate('/login');
        return;
      }

      // CORRECTED: Send POST request to /api/reviews (without productId in URL)
      // and include productId in the request body.
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Send the token in the header
        },
        body: JSON.stringify({
          productId: productToReview._id, // Pass productId in the body
          stars: rating,
          comments: reviewText,
        }),
      });

      // Check if the response is OK before trying to parse as JSON
      if (!response.ok) {
        // Attempt to parse error as JSON if backend sends it, otherwise use text
        const errorData = await response.json().catch(() => response.text());
        const errorMessage = typeof errorData === 'object' ? (errorData.message || errorData.msg) : errorData;
        throw new Error(errorMessage || 'Failed to submit review');
      }

      const data = await response.json(); // Only parse as JSON if response is OK

      setMessage(data.message || data.msg || 'Review submitted successfully!');
      setRating(0); // Reset rating
      setReviewText(''); // Clear review text
      // Optionally navigate back to product page or home after review
      // setTimeout(() => navigate(`/product/${productToReview._id}`), 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading product for review...
      </div>
    );
  }

  if (productError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Error: {productError}. Cannot load product for review.
        <button onClick={() => navigate('/')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Back to Home</button>
      </div>
    );
  }

  if (!productToReview) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Product not found for review.
        <button onClick={() => navigate('/')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex flex-col items-center md:w-1/3 p-4 bg-white rounded-xl shadow-lg">
          <img
            src={productToReview.product_image || 'https://placehold.co/150x150/CCCCCC/FFFFFF?text=No+Image'} // Fallback for missing image
            alt={productToReview.name || 'Product Image'} // Fallback for missing name
            className="max-w-full h-auto rounded-lg mb-6 border border-gray-200"
          />
          <p className="text-lg font-semibold text-gray-800 text-center">{productToReview.name || 'Unknown Product'}</p>
        </div>

        <div className="flex-grow md:w-2/3 p-4 flex flex-col items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mb-6">
            <h3 className="text-2xl font-light text-center mb-6 text-gray-800">Rate this Product</h3>
            <div className="flex justify-center mb-6 space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`w-10 h-10 cursor-pointer transition-colors duration-200 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>

            <div className="p-4 border border-gray-300 rounded-lg">
              <textarea
                className="w-full h-32 p-2 resize-none focus:outline-none"
                placeholder="Enter your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
            </div>
          </div>

          {message && (
            <div className={`text-center text-sm mb-4 ${message.includes('Error') || message.includes('Please') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}

          <button
            onClick={handleSubmitReview}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md w-full max-w-md"
          >
            Submit Review
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ReviewPage;
