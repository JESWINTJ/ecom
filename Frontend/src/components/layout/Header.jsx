import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('User logged out');
    navigate('/login');
  };

  return (
    <header className="bg-white p-4 shadow-md flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-blue-600">BUYIT</Link>

      <div className="flex items-center space-x-4">
        <Link to="/login" className="flex items-center text-gray-700 hover:text-blue-600 rounded-full p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="ml-1 hidden sm:inline">login</span>
        </Link>

        <Link to="/orders" className="text-gray-700 hover:text-blue-600 rounded-full p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="ml-1 hidden sm:inline">Orders</span>
        </Link>

        <Link to="/cart" className="text-gray-700 hover:text-blue-600 rounded-full p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </Link>

        <Link to="/Userprofile" className="text-gray-700 hover:text-blue-600 rounded-full p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
         <Link to="/" className="text-gray-700 hover:text-blue-600 rounded-full p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9.75L12 3l9 6.75M4.5 10.5V21a1.5 1.5 0 001.5 1.5h12A1.5 1.5 0 0021 21V10.5M9 22.5V15h6v7.5" />
          </svg>
        </Link>

        {localStorage.getItem('token') && (
          <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-blue-600 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="ml-1 hidden sm:inline">logout</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
