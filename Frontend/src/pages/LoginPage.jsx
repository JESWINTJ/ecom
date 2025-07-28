import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import axiosInstance from '../api/axiosConfig.js';

function LoginPage() {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailId,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      // Store token and user data
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Login successful for user:', data.user);
      } else {
        throw new Error('Login data incomplete');
      }

      setMessage('Login successful! Redirecting...');
      
      // Handle role-based redirection
      const userRoles =  data.user.role;
      console.log('User roles:', userRoles);
      // console.log('User roles:', userRoles);
      
      if (userRoles.includes('admin')) {
        setTimeout(() => navigate('/admindashboard'), 1500);
      } 
      else if (userRoles.includes('seller')) {
        
        // If user is both seller and buyer, prioritize seller dashboard
        setTimeout(() => navigate('/sellerdashboard'), 1500);
        } 
      else if (userRoles.includes('buyer')) {
        setTimeout(() => navigate('/'), 1500);
      } 
      else {
        // Default for other cases
        setTimeout(() => navigate('/'), 1500);
      }

    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
      setEmailId('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto p-4 flex items-center justify-center relative">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 opacity-50">
          <section className="bg-blue-100 rounded-xl p-8 mb-8 text-center text-blue-800 text-xl font-medium shadow-inner">
            banners ads
          </section>
          <section className="mb-8">
            <h3 className="text-2xl font-medium text-gray-800 mb-4">Best of electronics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-blue-100 rounded-xl p-4 flex flex-col items-center justify-center shadow-md">
                  <img 
                    src={`https://placehold.co/100x100/ADD8E6/000000?text=Product${item}`} 
                    alt={`Product ${item}`} 
                    className="rounded-lg mb-2" 
                  />
                  <span className="text-gray-700 text-sm">Product {item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Login Form */}
        <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-md z-10">
          <h2 className="text-3xl font-light text-center mb-6 text-gray-800">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-emailId" className="block text-gray-700 text-sm font-light mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="login-emailId"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-gray-700 text-sm font-light mb-1">
                Password
              </label>
              <input
                type="password"
                id="login-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {message && (
              <div className={`text-center text-sm ${
                message.includes('successful') ? 'text-green-600' : 'text-red-500'
              }`}>
                {message}
              </div>
            )}

            <div className="flex flex-col items-start mt-6 space-y-2">
              <button 
                type="button" 
                className="text-sm text-blue-600 hover:underline"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </button>
              <p className="text-sm text-gray-600">
                New User?{' '}
                <button 
                  type="button"
                  className="text-blue-600 hover:underline ml-1"
                  onClick={() => navigate('/register')}
                >
                  Sign up here
                </button>
              </p>
              <p className="text-sm text-gray-600">
                New Seller?{' '}
                <button 
                  type="button"
                  className="text-blue-600 hover:underline ml-1"
                  onClick={() => navigate('/register/seller')}
                >
                  Register as seller
                </button>
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-light shadow-md ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;