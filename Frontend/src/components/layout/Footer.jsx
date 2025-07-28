import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white p-4 shadow-t-md flex justify-between items-center mt-auto">
      <Link to="/about" className="text-gray-700 hover:text-blue-600 text-sm">about</Link>
      <Link to="/contact" className="text-gray-700 hover:text-blue-600 text-sm">contact us</Link>
    </footer>
  );
}

export default Footer;
