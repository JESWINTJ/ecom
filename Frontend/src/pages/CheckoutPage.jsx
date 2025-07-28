import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

function CheckoutPage() {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation hook

  // Access data passed from CartPage via location.state
  // Provide default empty object to prevent errors if state is null
  const { cartData, discountAmount, couponsAmount, platformFeeAmount, totalAmount, savedAmount } = location.state || {};

  // If cartData is not available, redirect or show an error
  if (!cartData) {
    // This handles direct navigation to /checkout or if state is lost
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Cart data not found. Please go back to your cart.
        <button onClick={() => navigate('/cart')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Go to Cart</button>
      </div>
    );
  }

  // Price details are now directly from passed state
  const itemPrice = cartData.price * cartData.quantity;


  const handleProceedToPayment = () => {
    if (!deliveryAddress.trim()) {
      setMessage('Please enter a delivery address.');
      return;
    }
    console.log('Delivery Address:', deliveryAddress);
    console.log('Proceeding to payment options...');
    setMessage('Proceeding to payment options (functionality not implemented)');
    // Pass relevant data to the payment page as well
    navigate('/payment', {
      state: {
        deliveryAddress,
        cartData,
        totalAmount,
        // Pass other price breakdown details if needed on payment page
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Header />

      {/* Main Content Area - Checkout Details */}
      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row items-start md:items-stretch gap-8">
        {/* Delivery Address and Payment Options */}
        <div className="flex flex-col md:w-2/3 p-4 bg-white rounded-xl shadow-lg">
          <div className="bg-yellow-100 p-4 rounded-lg mb-6 text-gray-800 font-semibold text-lg">
            Enter delivery address
          </div>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 h-32 resize-y"
            placeholder="Enter your full delivery address here..."
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            rows="4"
          ></textarea>

          {message && (
            <div className={`text-center text-sm mb-4 ${message.includes('Please') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}

          <button
            onClick={handleProceedToPayment}
            className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center hover:bg-yellow-500 transition duration-300 shadow-md"
          >
            Payment options
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        {/* Price Details (now dynamic) */}
        <div className="md:w-1/3 p-4 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-medium text-gray-800 mb-4 border-b pb-3">PRICE DETAILS</h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Price ({cartData.quantity} item)</span>
              <span>₹{itemPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">- ₹{discountAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Coupons for you</span>
              <span className="text-green-600">- ₹{couponsAmount}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Platform Fee</span>
              <span>₹{platformFeeAmount}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
          <p className="text-green-600 font-semibold mt-4">
            You will save ₹{savedAmount} on this order
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CheckoutPage;