import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

function SellerDashboardPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState(null); // To store user's role

  useEffect(() => {
    // Basic check for seller role (in a real app, you'd verify token on backend)
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to access the seller dashboard.');
      navigate('/login');
      return;
    }

    // Decode token to get role (client-side, for display purposes only)
    // For security, always verify role on the backend for protected routes.
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      if (decodedToken.user && decodedToken.user.role) {
        setUserRole(decodedToken.user.role);
        if (decodedToken.user.role !== 'seller' && decodedToken.user.role !== 'admin') {
          setMessage('You are not authorized to view this page.');
          // Redirect non-sellers
          // setTimeout(() => navigate('/'), 2000);
        }
      } else {
        setMessage('Could not determine user role.');
        // setTimeout(() => navigate('/'), 2000);
      }
    } catch (e) {
      console.error("Error decoding token:", e);
      setMessage('Invalid session. Please log in again.');
      localStorage.removeItem('token');
      // setTimeout(() => navigate('/login'), 2000);
    }

  }, [navigate]);

  if (userRole && userRole !== 'seller' && userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        {message}
        <button onClick={() => navigate('/')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-3xl font-light text-gray-800 mb-6 text-center">Seller Dashboard</h2>

        {message && (
          <div className={`text-center text-sm mb-4 ${message.includes('authorized') || message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/add-product" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center">
            <div className="text-5xl text-blue-600 mb-4">+</div>
            <h3 className="text-xl font-semibold text-gray-800">Add New Product</h3>
            <p className="text-gray-600 text-sm mt-2">List a new item for sale.</p>
          </Link>

          <Link to="/seller/products" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center">
            <div className="text-5xl text-green-600 mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800">Manage Products</h3>
            <p className="text-gray-600 text-sm mt-2">View, edit, or delete your listings.</p>
          </Link>

          <Link to="/seller/orders" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center">
            <div className="text-5xl text-purple-600 mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-800">View Orders</h3>
            <p className="text-gray-600 text-sm mt-2">Track and fulfill customer orders.</p>
          </Link>

          {/* Add more seller-specific links here */}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SellerDashboardPage;
