// OrderConfirmationPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderedProduct: passedProduct, userData: passedUser } = location.state || {};

  const [orderedProduct, setOrderedProduct] = useState(passedProduct || null);
  const [userData, setUserData] = useState(passedUser || null);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  function safeParse(json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const saveOrderToDatabase = async () => {
      const token = localStorage.getItem('token');

      // Safely get user and product data
      const userFromStorage = localStorage.getItem('user');
      const productFromStorage = localStorage.getItem('orderedProduct');

      const user =
        passedUser ||
        (userFromStorage && userFromStorage !== "undefined" && userFromStorage !== "" ? safeParse(userFromStorage) : null);

      const product =
        passedProduct ||
        (productFromStorage ? safeParse(productFromStorage) : null);

      if (user) setUserData(user);
      if (product) setOrderedProduct(product);

      if (!token || !user?._id || !product?._id) {
        setError('Missing token, user, or product data');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            deliveryTo: user._id,
            billingTo: user._id,
            items: [
              {
                product: product._id,
                unitsOrdered: 1,
              },
            ],
          }),
        });

        if (!response.ok) {
          const errRes = await response.json();
          console.error('Failed to place order:', errRes);
          setError('Order placement failed');
        } else {
          const data = await response.json();
          console.log('Order placed successfully:', data);
          setOrderPlaced(true);
        }
      } catch (err) {
        console.error('Network error:', err);
        setError('Network error while placing order');
      }
    };

    saveOrderToDatabase();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Header />

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center p-8">
          {error ? (
            <div className="text-red-600">
              <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
              <p>{error}</p>
            </div>
          ) : orderPlaced ? (
            <>
              <h1 className="text-3xl font-bold mb-4 text-green-600">Order Confirmed ✅</h1>
              <p className="text-lg mb-2">Thank you, {userData?.name}!</p>
              <p className="mb-2">
                Your order for <strong>{orderedProduct?.name}</strong> has been placed.
              </p>
              <p className="mb-6">Confirmation sent to: <em>{userData?.email}</em></p>
              <button
                onClick={() => navigate('/orders')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
              >
                View Order History
              </button>
            </>
          ) : (
            <p className="text-lg">Placing your order...</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderConfirmationPage;
