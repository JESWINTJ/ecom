import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi'); // 'upi', 'card', 'cod', 'googlepay'
  const [upiId, setUpiId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation hook

  // Access data passed from CheckoutPage via location.state
  const { deliveryAddress, cartData, totalAmount } = location.state || {}; // Destructure with default empty object

  // If totalAmount or cartData is not available, redirect or show an error
  if (!totalAmount || !cartData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Payment details not found. Please go back to checkout.
        <button onClick={() => navigate('/checkout')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Go to Checkout</button>
      </div>
    );
  }

  const handlePay = () => {
    if (selectedPaymentMethod === 'upi' && !upiId.trim()) {
      setMessage('Please enter a UPI ID.');
      return;
    }

    console.log(`Paying ₹${totalAmount} via ${selectedPaymentMethod}`);
    console.log('Delivery Address:', deliveryAddress); // Log delivery address received
    console.log('Cart Data:', cartData); // Log cart data received
    setMessage(`Payment initiated for ₹${totalAmount} via ${selectedPaymentMethod}.`);

    // In a real app, you'd send this to your backend for order processing
    // and then navigate to order confirmation on success.
    setTimeout(() => navigate('/order-confirmation', {
      state: {
        orderTotal: totalAmount,
        orderedProduct: cartData, // Pass the product that was ordered
        // You might pass orderId from backend response here
      }
    }), 1500); // Simulate payment processing
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Header />

      {/* Main Content Area - Payment Options */}
      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row items-start md:items-stretch gap-8">
        {/* Payment Method Selection */}
        <div className="flex flex-col md:w-1/3 bg-white rounded-xl shadow-lg overflow-hidden">
          <button
            className={`w-full text-left p-4 text-lg font-medium ${selectedPaymentMethod.startsWith('upi') ? 'bg-gray-200 text-blue-600' : 'hover:bg-gray-50 text-gray-800'}`}
            onClick={() => setSelectedPaymentMethod('upi')}
          >
            UPI
          </button>
          <div className="border-t border-gray-200"></div>
          <button
            className={`w-full text-left p-4 text-lg font-medium ${selectedPaymentMethod === 'card' ? 'bg-gray-200 text-blue-600' : 'hover:bg-gray-50 text-gray-800'}`}
            onClick={() => setSelectedPaymentMethod('card')}
          >
            DEBIT/CREDIT CARD
          </button>
          <div className="border-t border-gray-200"></div>
          <button
            className={`w-full text-left p-4 text-lg font-medium ${selectedPaymentMethod === 'cod' ? 'bg-gray-200 text-blue-600' : 'hover:bg-gray-50 text-gray-800'}`}
            onClick={() => setSelectedPaymentMethod('cod')}
          >
            CASH ON DELIVERY
          </button>
        </div>

        {/* Payment Details and Action */}
        <div className="flex-grow md:w-2/3 p-4 bg-white rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            {selectedPaymentMethod.startsWith('upi') && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="googlePay"
                    name="upiOption"
                    value="googlepay"
                    checked={selectedPaymentMethod === 'googlepay'}
                    onChange={() => setSelectedPaymentMethod('googlepay')}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <label htmlFor="googlePay" className="ml-2 text-lg text-gray-800 font-medium">GOOGLE PAY</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="addUpiId"
                    name="upiOption"
                    value="upi"
                    checked={selectedPaymentMethod === 'upi'}
                    onChange={() => setSelectedPaymentMethod('upi')}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <label htmlFor="addUpiId" className="ml-2 text-lg text-gray-800 font-medium">ADD UPI ID</label>
                </div>
                {selectedPaymentMethod === 'upi' && ( // Only show input if 'ADD UPI ID' is selected
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                    placeholder="Enter UPI ID (e.g., yourname@bank)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                )}
              </div>
            )}

            {selectedPaymentMethod === 'card' && (
              <div className="text-gray-700 text-lg">
                <p>Debit/Credit Card payment options would appear here.</p>
                {/* You would add a form for card details here */}
              </div>
            )}

            {selectedPaymentMethod === 'cod' && (
              <div className="text-gray-700 text-lg">
                <p>You have selected Cash On Delivery.</p>
                <p>Please confirm your order to proceed.</p>
              </div>
            )}
          </div>

          {message && (
            <div className={`text-center text-sm mt-4 ${message.includes('Please') || message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}

          <button
            onClick={handlePay}
            className="w-full bg-yellow-400 text-gray-800 font-semibold py-3 px-6 rounded-lg text-lg mt-6 hover:bg-yellow-500 transition duration-300 shadow-md"
          >
            PAY {totalAmount}/-
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PaymentPage;
