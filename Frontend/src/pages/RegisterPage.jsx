import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Frontend validation
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name:username,
          email,
          phone:phoneNumber,
          password: newPassword,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Registration failed ');
      }

      setMessage('Registration successful! Redirecting to dashboard...');
      
      // Store token and user data if registration also logs in
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Clear form on success
      setUsername('');
      setNewPassword('');
      setConfirmPassword('');
      setPhoneNumber('');
      setEmail('');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto p-4 flex items-center justify-center relative">
        <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-md z-10">
          <h2 className="text-3xl font-light text-center mb-6 text-gray-800">Sign Up</h2>
          
          {message && (
            <div className={`mb-4 p-3 rounded-md text-center ${
              message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-700 text-sm font-light mb-1">Username</label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-light mb-1">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-light mb-1">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-gray-700 text-sm font-light mb-1">Password</label>
              <input
                type="password"
                id="newPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength="8"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-light mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength="8"
                required
              />
            </div>

            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button 
                  type="button"
                  className="text-blue-600 hover:underline focus:outline-none"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-light shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default RegisterPage;